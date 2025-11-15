import { pool } from "../config/db.js";

export const NotificacionesModel = {
    
    crearNotificacion: async (usuario_id, tipo, titulo, mensaje, relacion_id = null) => {
        const [result] = await pool.query(
            `INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, relacion_id)
             VALUES (?, ?, ?, ?, ?)`,
            [usuario_id, tipo, titulo, mensaje, relacion_id]
        );
        return result.insertId;
    },

    obtenerNotificacionesUsuario: async (usuario_id, limit = 20) => {
        const [rows] = await pool.query(
            `SELECT * FROM notificaciones 
             WHERE usuario_id = ? 
             ORDER BY fecha_creacion DESC 
             LIMIT ?`,
            [usuario_id, limit]
        );
        return rows;
    },

    marcarComoLeida: async (notificacion_id, usuario_id) => {
        const [result] = await pool.query(
            `UPDATE notificaciones SET leida = TRUE 
             WHERE id = ? AND usuario_id = ?`,
            [notificacion_id, usuario_id]
        );
        return result.affectedRows > 0;
    },

    contarNoLeidas: async (usuario_id) => {
        const [rows] = await pool.query(
            `SELECT COUNT(*) as total FROM notificaciones 
             WHERE usuario_id = ? AND leida = FALSE`,
            [usuario_id]
        );
        return rows[0].total;
    }

};