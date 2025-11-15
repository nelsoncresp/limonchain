
import { pool } from "../config/db.js";

export const DashboardController = {

    metricasAgricultor: async (req, res) => {
        try {
            if (req.user.rol !== "AGRICULTOR") {
                return res.status(403).json({ error: "Solo agricultores pueden ver este dashboard" });
            }

            const agricultor_id = req.user.id;

            const [metricas] = await pool.query(`
                SELECT 
                    -- Lotes
                    COUNT(*) as total_lotes,
                    SUM(CASE WHEN estado = 'DISPONIBLE' THEN 1 ELSE 0 END) as lotes_disponibles,
                    SUM(CASE WHEN estado = 'ENTREGADO' THEN 1 ELSE 0 END) as lotes_entregados,
                    
                    -- Contratos
                    (SELECT COUNT(*) FROM contratos WHERE agricultor_id = ?) as total_contratos,
                    (SELECT COUNT(*) FROM contratos WHERE agricultor_id = ? AND estado = 'ENTREGADO') as contratos_completados,
                    
                    -- Ventas
                    SUM(CASE WHEN estado = 'ENTREGADO' THEN cantidad ELSE 0 END) as kg_vendidos,
                    SUM(CASE WHEN estado = 'ENTREGADO' THEN cantidad * c.precio_unitario ELSE 0 END) as ingresos_totales
                FROM lotes l
                LEFT JOIN contratos c ON l.id = c.lote_id
                WHERE l.agricultor_id = ?
            `, [agricultor_id, agricultor_id, agricultor_id]);

            // Reputación
            const [reputacion] = await pool.query(`
                SELECT AVG(puntuacion) as promedio
                FROM blockchain_blocks 
                WHERE calificado_id = ? AND tipo = 'CALIFICACION'
            `, [agricultor_id]);

            res.json({
                metricas: metricas[0],
                reputacion: reputacion[0].promedio || 5.0,
                resumen: {
                    eficiencia: metricas[0].contratos_completados / Math.max(metricas[0].total_contratos, 1) * 100,
                    ocupacion: (metricas[0].lotes_entregados / Math.max(metricas[0].total_lotes, 1)) * 100
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener métricas" });
        }
    },

    metricasComprador: async (req, res) => {
        try {
            if (req.user.rol !== "COMPRADOR") {
                return res.status(403).json({ error: "Solo compradores pueden ver este dashboard" });
            }

            const comprador_id = req.user.id;

            const [metricas] = await pool.query(`
                SELECT 
                    COUNT(*) as total_compras,
                    SUM(CASE WHEN estado = 'ENTREGADO' THEN 1 ELSE 0 END) as compras_completadas,
                    SUM(cantidad) as kg_comprados,
                    AVG(c.precio_unitario) as precio_promedio_kg
                FROM contratos c
                WHERE c.comprador_id = ?
            `, [comprador_id]);

            res.json({ metricas: metricas[0] });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener métricas" });
        }
    }

};