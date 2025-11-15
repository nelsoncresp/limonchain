import { pool } from "../config/db.js";
import crypto from "crypto";

export const BlockchainModel = {

    // Crear un nuevo bloque en blockchain_blocks
    addBlock: async (data) => {
        const [last] = await pool.query(
            "SELECT hash FROM blockchain_blocks ORDER BY id DESC LIMIT 1"
        );
        const previousHash = last.length ? last[0].hash : "0";

        const hash = crypto.createHash("sha256")
            .update(JSON.stringify(data) + previousHash)
            .digest("hex");

        const [result] = await pool.query(
            `INSERT INTO blockchain_blocks
            (contrato_id, lote_id, agricultor_id, comprador_id, analista_id, cantidad, precio_unitario, estado, hash, previous_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.contrato_id,
                data.lote_id,
                data.agricultor_id,
                data.comprador_id,
                data.analista_id,
                data.cantidad,
                data.precio_unitario,
                data.estado,
                hash,
                previousHash
            ]
        );

        return { id: result.insertId, ...data, hash, previousHash };
    },

    // Obtener todos los bloques
    getAllBlocks: async () => {
        const [rows] = await pool.query("SELECT * FROM blockchain_blocks ORDER BY id ASC");
        return rows;
    },

    // Obtener nodos activos
    getNodosActivos: async () => {
        const [rows] = await pool.query("SELECT * FROM blockchain_nodos WHERE estado='ACTIVO'");
        return rows;
    },

    // Crear confirmación pendiente para un nodo
    crearConfirmacion: async (bloque_id, nodo_id) => {
        await pool.query(
            "INSERT INTO blockchain_confirmaciones (bloque_id, nodo_id) VALUES (?, ?)",
            [bloque_id, nodo_id]
        );
    },

    // Confirmar bloque por un nodo
    confirmarBloque: async (bloque_id, nodo_id) => {
        await pool.query(
            "UPDATE blockchain_confirmaciones SET confirmado=1 WHERE bloque_id=? AND nodo_id=?",
            [bloque_id, nodo_id]
        );
    },

    // Verificar consenso (ejemplo: >= 66% de nodos confirman)
    verificarConsenso: async (bloque_id) => {
        const [rows] = await pool.query(
            "SELECT COUNT(*) AS total, SUM(confirmado) AS confirmados FROM blockchain_confirmaciones WHERE bloque_id=?",
            [bloque_id]
        );

        if (rows.length === 0) return false;
        return rows[0].confirmados / rows[0].total >= 0.66;
    },
    registrarCalificacion: async (contrato_id, calificador_id, calificado_id, puntuacion, comentario) => {
        const data = {
            tipo: 'CALIFICACION',
            contrato_id,
            calificador_id, 
            calificado_id,
            puntuacion,
            comentario,
            timestamp: new Date().toISOString()
        };

        return await BlockchainModel.addBlock(data);
    },

    obtenerCalificacionesUsuario: async (usuario_id) => {
        const [rows] = await pool.query(
            `SELECT * FROM blockchain_blocks 
             WHERE calificado_id = ? AND tipo = 'CALIFICACION'
             ORDER BY fecha_creacion DESC`,
            [usuario_id]
        );
        return rows;
    }


};
