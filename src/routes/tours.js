import { Router } from 'express';
import Tour from '../models/Tour.js';
const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const filter = { active: true, date: { $gte: new Date() } };
    if (req.query.city) filter.city = req.query.city;
    if (req.query.category) filter.category = req.query.category;
    const tours = await Tour.find(filter).populate('provider', 'name').sort({ date: 1 });
    res.json(tours);
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('provider', 'name');
    if (!tour || !tour.active) return res.status(404).json({ message: 'Passeio não encontrado.' });
    res.json(tour);
  } catch (e) { next(e); }
});
export default router;