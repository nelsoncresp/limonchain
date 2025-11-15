import { pool } from "../config/db.js";

export const AnalisisModel = {

    obtenerPendientes: async () => {
        const [rows] = await pool.query(`
            SELECT c.*, 
                   u.nombre AS comprador,
                   a.nombre AS agricultor
            FROM contratos c
            JOIN users u ON c.comprador_id = u.id
            JOIN users a ON c.agricultor_id = a.id
            WHERE c.estado = 'PENDIENTE_ANALISIS'
        `);
        return rows;
    },

    obtenerDetalle: async (id) => {
        const [rows] = await pool.query(`
            SELECT c.*, 
                   u.nombre AS comprador,
                   a.nombre AS agricultor,
                   l.nombre AS lote,
                   l.cantidad AS lote_cantidad,
                   l.unidad AS lote_unidad
            FROM contratos c
            JOIN users u ON c.comprador_id = u.id
            JOIN users a ON c.agricultor_id = a.id
            JOIN lotes l ON l.id = c.lote_id
            WHERE c.id = ?
        `, [id]);

        return rows[0];
    },

    aprobar: async (id, analista_id) => {
    const [result] = await pool.query(`
        UPDATE contratos
        SET estado = 'APROBADO_ANALISTA',
            analista_id = ?
        WHERE id = ?
    `, [analista_id, id]);

    return result.affectedRows > 0;
},


    rechazar: async (id, comentario) => {
        const [result] = await pool.query(`
            UPDATE contratos
            SET estado = 'RECHAZADO',
                motivo_rechazo = ?
            WHERE id = ?
        `, [comentario, id]);

        return result.affectedRows > 0;
    }

};
