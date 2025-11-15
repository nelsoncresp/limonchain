import { verifyToken } from '../services/jwt.service.js';
import { getUserById } from '../models/user.model.js';

export async function auth(req, res, next) {
  try {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ message: 'Falta token' });

    const token = header.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await getUserById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Usuario no válido' });

    req.user = user;
    next();
  } catch (err) {
    next({ status: 401, message: 'Token inválido' });
  }
}
