import { pool } from "../config/db.js";
export const contratosDetalle = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                c.id,
                c.estado,
                c.fecha_creacion,
                c.fecha_actualizacion,
                c.fecha_entrega,
                a.nombre AS agricultor,
                b.nombre AS comprador,
                l.nombre AS lote,
                l.cantidad,
                l.unidad,
                l.calidad
            FROM contratos c
            LEFT JOIN users a ON c.agricultor_id = a.id
            LEFT JOIN users b ON c.comprador_id = b.id
            LEFT JOIN lotes l ON c.lote_id = l.id
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
                hash,
                previous_hash,
                fecha_creacion
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
                SUM(cantidad) AS cantidad_total
            FROM lotes
            GROUP BY estado;
        `);

        res.json({ lotes: rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener lotes detalle" });
    }
};

