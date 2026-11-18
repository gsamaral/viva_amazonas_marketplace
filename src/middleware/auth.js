import jwt from 'jsonwebtoken';
export function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ message: 'Faça login para continuar.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    next();
  } catch { return res.status(401).json({ message: 'Sessão inválida ou expirada.' }); }
}