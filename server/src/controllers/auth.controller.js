import Joi from 'joi';
import { createUser, getUserByEmail } from '../models/user.model.js';
import { hashPassword, comparePassword } from '../services/password.service.js';
import { createToken } from '../services/jwt.service.js';

const registerSchema = Joi.object({
  nombre: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  telefono: Joi.string().allow(null, ''),
  rol: Joi.string().valid('AGRICULTOR', 'COMPRADOR').required()
});

export async function register(req, res, next) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const exists = await getUserByEmail(value.email);
    if (exists) return res.status(400).json({ message: 'El email ya está registrado' });

    const password_hash = await hashPassword(value.password);

    const user = await createUser({
      nombre: value.nombre,
      email: value.email,
      password_hash,
      telefono: value.telefono,
      rol: value.rol
    });

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = createToken({ id: user.id, rol: user.rol });

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
}
