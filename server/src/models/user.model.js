// models/user.model.js
import { pool } from '../config/db.js';

export async function createUser({ nombre, email, password_hash, telefono, rol }) {
  const [result] = await pool.query(
    `INSERT INTO users (nombre, email, password_hash, telefono, rol, estado)
     VALUES (?, ?, ?, ?, ?, 1)`,
    [nombre, email, password_hash, telefono, rol]
  );
  return getUserById(result.insertId);
}

export async function getUserByEmail(email) {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

export async function getUserById(id) {
  const [rows] = await pool.query(
    `SELECT id, nombre, email, telefono, rol, estado, fecha_creacion 
     FROM users WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function getAllUsers() {
  const [rows] = await pool.query(`
    SELECT id, nombre, email, telefono, rol, estado, fecha_creacion 
    FROM users 
    ORDER BY fecha_creacion DESC
  `);
  return rows;
}

export async function updateUser(id, updates) {
  const allowedFields = ['nombre', 'telefono', 'rol', 'estado'];
  const fieldsToUpdate = {};
  
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      fieldsToUpdate[field] = updates[field];
    }
  });

  if (Object.keys(fieldsToUpdate).length === 0) {
    return getUserById(id);
  }

  const setClause = Object.keys(fieldsToUpdate).map(field => `${field} = ?`).join(', ');
  const values = [...Object.values(fieldsToUpdate), id];

  const [result] = await pool.query(
    `UPDATE users SET ${setClause} WHERE id = ?`,
    values
  );

  if (result.affectedRows === 0) return null;
  return getUserById(id);
}

export async function deleteUser(id) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}