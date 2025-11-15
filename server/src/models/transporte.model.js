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

    obtenerPorTransportista: async (transportista_id) => {
        const [rows] = await pool.query(`
            SELECT t.*, c.id as contrato_id, l.nombre as lote_nombre, 
                   a.nombre as agricultor_nombre, comp.nombre as comprador_nombre,
                   l.ubicacion as origen, c.direccion_entrega as destino
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

    actualizarEstado: async (transporte_id, estado, evidencia_url = null) => {
        const [result] = await pool.query(
            `UPDATE transporte SET estado = ?, evidencia_url = ? WHERE id = ?`,
            [estado, evidencia_url, transporte_id]
        );
        return result.affectedRows > 0;
    },

    obtenerPorContrato: async (contrato_id) => {
        const [rows] = await pool.query(`
            SELECT t.*, u.nombre as transportista_nombre, u.telefono as transportista_telefono
            FROM transporte t
            JOIN users u ON t.transportista_id = u.id
            WHERE t.contrato_id = ?
        `, [contrato_id]);
        return rows[0] || null;
    },
    obtenerPorTransportista: async (transportista_id) => {
    const [rows] = await pool.query(`
        SELECT t.*, c.id as contrato_id, l.nombre as lote_nombre, 
               a.nombre as agricultor_nombre, comp.nombre as comprador_nombre,
               t.ruta as ruta_entrega  -- ← Usamos la ruta del transporte
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

    obtenerPorId: async (id) => {
        const [rows] = await pool.query(`
            SELECT t.*, c.id as contrato_id, c.lote_id
            FROM transporte t
            JOIN contratos c ON t.contrato_id = c.id
            WHERE t.id = ?
        `, [id]);
        return rows[0] || null;
    }

};