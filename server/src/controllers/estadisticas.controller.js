import { pool } from "../config/db.js";
export const contratosDetalle = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                c.id,
                c.estado,
                c.fecha_creacion,
                c.fecha_aprobado,
                c.fecha_blockchain,
                a.nombre AS agricultor,
                b.nombre AS comprador,
                l.nombre AS lote,
                l.peso,
                l.variedad
            FROM contratos c
            LEFT JOIN users a ON c.id_agricultor = a.id
            LEFT JOIN users b ON c.id_comprador = b.id
            LEFT JOIN lotes l ON c.id_lote = l.id
            ORDER BY c.fecha_creacion DESC;
        `);

        res.json({ contratos: rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener contratos detallados" });
    }
};
export const blockchainDetalle = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                id,
                index_block,
                timestamp,
                hash,
                previous_hash,
                JSON_LENGTH(data) AS total_contratos,
                data
            FROM blockchain_blocks
            ORDER BY id DESC
            LIMIT 20;
        `);

        res.json({ blocks: rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en blockchain detalle" });
    }
};
export const actividadDiaria = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                DATE(fecha_creacion) AS fecha,
                COUNT(*) AS total
            FROM contratos
            GROUP BY DATE(fecha_creacion)
            ORDER BY fecha DESC
            LIMIT 30;
        `);

        res.json({ actividad: rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener actividad diaria" });
    }
};
export const lotesDetalle = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                estado,
                COUNT(*) AS total,
                SUM(peso) AS peso_total
            FROM lotes
            GROUP BY estado;
        `);

        res.json({ lotes: rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener lotes detalle" });
    }
};
