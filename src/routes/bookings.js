import { Router } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.use(authenticate);
router.get('/mine', async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate({ path: 'tour', populate: { path: 'provider', select: 'name' } }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (e) { next(e); }
});
router.post('/checkout', async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const items = req.body.items;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Seu carrinho está vazio.' });
    const normalized = new Map();
    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!item.tourId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20)
        return res.status(400).json({ message: 'Item ou quantidade inválida.' });
      normalized.set(String(item.tourId), (normalized.get(String(item.tourId)) || 0) + quantity);
    }
    const created = [];
    await session.withTransaction(async () => {
      for (const [tourId, quantity] of normalized) {
        const tour = await Tour.findOneAndUpdate(
          { _id: tourId, active: true, date: { $gte: new Date() }, availableSpots: { $gte: quantity } },
          { $inc: { availableSpots: -quantity } },
          { new: true, session }
        );
        if (!tour) {
          const exists = await Tour.findById(tourId).session(session);
          throw Object.assign(new Error(exists ? `Vagas insuficientes ou passeio indisponível: ${exists.name}` : 'Passeio não encontrado.'), { status: 409 });
        }
        const booking = await Booking.create([{
          user: req.user.id, tour: tour._id, participants: quantity,
          unitPrice: tour.price, total: tour.price * quantity
        }], { session });
        created.push(booking[0]);
      }
    });
    const result = await Booking.find({ _id: { $in: created.map(b => b._id) } }).populate('tour');
    res.status(201).json({ message: 'Reserva confirmada!', bookings: result });
  } catch (e) { next(e); }
  finally { await session.endSession(); }
});
export default router;