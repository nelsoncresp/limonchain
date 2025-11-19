// models/transporte.model.js
import { pool } from '../config/db.js';

export const TransporteModel = {
    
    crearTransporte: async (contrato_id, transportista_id, ruta) => {
        const [result] = await pool.query(
            `INSERT INTO transporte (contrato_id, transportista_id, ruta, estado)
             VALUES (?, ?, ?, 'ASIGNADO')`,
            [contrato_id, transportista_id, ruta]
        );
        return result.insertId;
    },

    // Transportista ve sus transportes
    obtenerPorTransportista: async (transportista_id) => {
    const [rows] = await pool.query(`
        SELECT 
            t.*, 
            c.id AS contrato_id, 
            l.nombre AS lote_nombre, 
            a.nombre AS agricultor_nombre, 
            comp.nombre AS comprador_nombre,

            l.nombre AS origen,
            t.ruta AS destino,   -- 🔥 AQUÍ LA CORRECCIÓN REAL
            t.ruta AS ruta_entrega

        FROM transporte t
        JOIN contratos c ON t.contrato_id = c.id
        JOIN lotes l ON c.lote_id = l.id
        JOIN users a ON c.agricultor_id = a.id
        JOIN users comp ON c.comprador_id = comp.id
        WHERE t.transportista_id = ?
        ORDER BY t.fecha_asignacion DESC
    `, [transportista_id]);

    return rows;
},

    // Transportista reporta entrega
    reportarEntrega: async (transporte_id, evidencia_url) => {
        const [result] = await pool.query(
            `UPDATE transporte 
             SET estado = 'ENTREGADO', evidencia_url = ?, fecha_reporte = NOW()
             WHERE id = ?`,
            [evidencia_url, transporte_id]
        );
        return result.affectedRows > 0;
    },

    actualizarEstado: async (transporte_id, estado, evidencia_url = null) => {
        const [result] = await pool.query(
            `UPDATE transporte 
             SET estado = ?, evidencia_url = ?, fecha_actualizacion = NOW()
             WHERE id = ?`,
            [estado, evidencia_url, transporte_id]
        );
        return result.affectedRows > 0;
    },

    obtenerPorContrato: async (contrato_id) => {
        const [rows] = await pool.query(`
            SELECT 
                t.*, 
                u.nombre AS transportista_nombre, 
                u.telefono AS transportista_telefono
            FROM transporte t
            JOIN users u ON t.transportista_id = u.id
            WHERE t.contrato_id = ?
        `, [contrato_id]);

        return rows[0] || null;
    },

    obtenerPorId: async (id) => {
        const [rows] = await pool.query(`
            SELECT 
                t.*, 
                c.id AS contrato_id, 
                c.lote_id
            FROM transporte t
            JOIN contratos c ON t.contrato_id = c.id
            WHERE t.id = ?
        `, [id]);

        return rows[0] || null;
    }

};
