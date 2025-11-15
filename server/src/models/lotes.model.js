import { pool } from "../config/db.js";

export const LotesModel = {

    crearLote: async (data) => {
        const sql = `
            INSERT INTO lotes 
            (agricultor_id, nombre, descripcion, cantidad, unidad, calidad, fecha_cosecha, foto_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(sql, [
            data.agricultor_id,
            data.nombre,
            data.descripcion,
            data.cantidad,
            data.unidad,
            data.calidad,
            data.fecha_cosecha,
            data.foto_url
        ]);

        return { id: result.insertId, ...data };
    },


    obtenerLotesPorUsuario: async (agricultor_id) => {
        const [rows] = await pool.query(
            "SELECT * FROM lotes WHERE agricultor_id = ?",
            [agricultor_id]
        );
        return rows;
    },

    obtenerLoteById: async (id, agricultor_id) => {
        const [rows] = await pool.query(
            "SELECT * FROM lotes WHERE id = ? AND agricultor_id = ?",
            [id, agricultor_id]
        );
        return rows[0];
    },

    actualizarLote: async (id, agricultor_id, data) => {
        const sql = `
            UPDATE lotes SET nombre=?, descripcion=?, cantidad=?, unidad=?, calidad=?, fecha_cosecha=?, foto_url=?
            WHERE id=? AND agricultor_id=?
        `;

        const [result] = await pool.query(sql, [
            data.nombre,
            data.descripcion,
            data.cantidad,
            data.unidad,
            data.calidad,
            data.fecha_cosecha,
            data.foto_url,
            id,
            agricultor_id
        ]);

        return result.affectedRows > 0;
    },

    eliminarLote: async (id, agricultor_id) => {
        const [result] = await pool.query(
            "DELETE FROM lotes WHERE id = ? AND agricultor_id = ?",
            [id, agricultor_id]
        );
        return result.affectedRows > 0;
    },
    obtenerDisponibles: async () => {
        const sql = `
        SELECT 
            l.*, 
            u.nombre AS agricultor_nombre, 
            u.telefono AS agricultor_telefono
        FROM lotes l
        INNER JOIN users u ON l.agricultor_id = u.id
        WHERE l.estado = 'DISPONIBLE'
        ORDER BY l.fecha_creacion DESC
    `;

        const [rows] = await pool.query(sql);
        return rows;
    },
    obtenerLoteSinUsuario: async (id) => {
        const [rows] = await pool.query(
            "SELECT * FROM lotes WHERE id = ?",
            [id]
        );
        return rows[0] || null;
    },
    cambiarEstado: async (id, estado) => {
        const [result] = await pool.query(
            "UPDATE lotes SET estado = ? WHERE id = ?",
            [estado, id]
        );
        return result.affectedRows > 0;
    },
    obtenerLote: async (id) => {
        const [rows] = await pool.query(
            `SELECT l.*, u.nombre as agricultor_nombre 
             FROM lotes l 
             JOIN users u ON l.agricultor_id = u.id 
             WHERE l.id = ?`,
            [id]
        );
        return rows[0];
    },
    obtenerLoteSinRestriccion: async (id) => {
        const [rows] = await pool.query(
            `SELECT l.*, u.nombre as agricultor_nombre 
             FROM lotes l 
             JOIN users u ON l.agricultor_id = u.id 
             WHERE l.id = ?`,
            [id]
        );
        return rows[0];
    },

};
