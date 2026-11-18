import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = Router();
const publicUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role });
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6)
      return res.status(400).json({ message: 'Informe nome, e-mail e senha com pelo menos 6 caracteres.' });
    if (await User.exists({ email })) return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'dev-secret-change-me', { expiresIn: '7d' });
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e) { next(e); }
});
router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: String(req.body.email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password)))
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'dev-secret-change-me', { expiresIn: '7d' });
    res.json({ token, user: publicUser(user) });
  } catch (e) { next(e); }
});
export default router;