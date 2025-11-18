import { pool } from "../config/db.js";

export const ContratosModel = {

    crear: async (data) => {
        const sql = `
            INSERT INTO contratos
            (lote_id, agricultor_id, comprador_id, precio_unitario, cantidad, fecha_entrega)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(sql, [
            data.lote_id,
            data.agricultor_id,
            data.comprador_id,
            data.precio_unitario,
            data.cantidad,
            data.fecha_entrega
        ]);

        return {
            id: result.insertId,
            estado: "PENDIENTE_ANALISIS",
            ...data
        };
    },

    obtenerContrato: async (id) => {
        const [rows] = await pool.query(
            `SELECT c.*, l.nombre as lote_nombre, l.calidad, 
                    a.nombre as agricultor_nombre, comp.nombre as comprador_nombre
             FROM contratos c
             JOIN lotes l ON c.lote_id = l.id
             JOIN users a ON c.agricultor_id = a.id
             JOIN users comp ON c.comprador_id = comp.id
             WHERE c.id = ?`,
            [id]
        );
        return rows[0];
    },

    cambiarEstado: async (id, estado) => {
        const [result] = await pool.query(
            "UPDATE contratos SET estado = ? WHERE id = ?",
            [estado, id]
        );
        return result.affectedRows > 0;
    },

    // AGREGAR ESTOS MÉTODOS NUEVOS:
    obtenerPorAgricultor: async (agricultor_id) => {
        const [rows] = await pool.query(
            `SELECT c.*, l.nombre as lote_nombre, comp.nombre as comprador_nombre
             FROM contratos c
             JOIN lotes l ON c.lote_id = l.id
             JOIN users comp ON c.comprador_id = comp.id
             WHERE c.agricultor_id = ?
             ORDER BY c.fecha_creacion DESC`,
            [agricultor_id]
        );
        return rows;
    },

    obtenerPorComprador: async (comprador_id) => {
        const [rows] = await pool.query(
            `SELECT c.*, l.nombre as lote_nombre, a.nombre as agricultor_nombre
             FROM contratos c
             JOIN lotes l ON c.lote_id = l.id
             JOIN users a ON c.agricultor_id = a.id
             WHERE c.comprador_id = ?
             ORDER BY c.fecha_creacion DESC`,
            [comprador_id]
        );
        return rows;
    },

    obtenerTodos: async () => {
        const [rows] = await pool.query(
            `SELECT c.*, l.nombre as lote_nombre, 
                    a.nombre as agricultor_nombre, 
                    comp.nombre as comprador_nombre
             FROM contratos c
             JOIN lotes l ON c.lote_id = l.id
             JOIN users a ON c.agricultor_id = a.id
             JOIN users comp ON c.comprador_id = comp.id
             ORDER BY c.fecha_creacion DESC`
        );
        return rows;
    },
    

    obtenerPendientesAnalisis: async () => {
        const [rows] = await pool.query(
            `SELECT c.*, l.nombre as lote_nombre, 
                    a.nombre as agricultor_nombre, comp.nombre as comprador_nombre
             FROM contratos c
             JOIN lotes l ON c.lote_id = l.id
             JOIN users a ON c.agricultor_id = a.id
             JOIN users comp ON c.comprador_id = comp.id
             WHERE c.estado = 'PENDIENTE_ANALISIS'
             ORDER BY c.fecha_creacion DESC`
        );
        return rows;
    },
     getByComprador: async (req, res) => {
        try {
            const { compradorId } = req.params;
            
            console.log('🔍 Obteniendo contratos para comprador:', compradorId);
            
            // Verificar autorización
            if (req.user.rol !== "ADMIN" && parseInt(req.user.id) !== parseInt(compradorId)) {
                return res.status(403).json({ error: "No autorizado para ver estos contratos" });
            }

            const contratos = await ContratosModel.obtenerPorComprador(compradorId);
            
            res.json(contratos);

        } catch (error) {
            console.error('❌ Error obteniendo contratos por comprador:', error);
            res.status(500).json({ 
                error: "Error al obtener contratos",
                details: error.message 
            });
        }
    },

    // ... 

};