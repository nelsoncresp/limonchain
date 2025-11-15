import { BlockchainModel } from "../models/blockchain.model.js";

export const ReputacionController = {

    calificar: async (req, res) => {
        try {
            const { contrato_id, calificado_id, puntuacion, comentario } = req.body;
            const calificador_id = req.user.id;

            // Verificar que el usuario participó en el contrato
            const [contrato] = await pool.query(
                `SELECT * FROM contratos 
                 WHERE id = ? AND (agricultor_id = ? OR comprador_id = ?)`,
                [contrato_id, req.user.id, req.user.id]
            );

            if (!contrato[0]) {
                return res.status(403).json({ error: "No puedes calificar este contrato" });
            }

            // Registrar en blockchain
            const bloque = await BlockchainModel.registrarCalificacion(
                contrato_id, 
                calificador_id, 
                calificado_id, 
                puntuacion, 
                comentario
            );

            res.json({ 
                message: "Calificación registrada en blockchain",
                bloque_id: bloque.id,
                hash: bloque.hash
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al registrar calificación" });
        }
    },

    obtenerMiReputacion: async (req, res) => {
        try {
            const usuario_id = req.user.id;
            const calificaciones = await BlockchainModel.obtenerCalificacionesUsuario(usuario_id);
            
            const promedio = calificaciones.length > 0 
                ? calificaciones.reduce((sum, c) => sum + c.puntuacion, 0) / calificaciones.length 
                : 5.0;

            res.json({
                promedio: Math.round(promedio * 10) / 10,
                total_calificaciones: calificaciones.length,
                calificaciones: calificaciones.slice(0, 10) // últimas 10
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener reputación" });
        }
    },

    obtenerReputacionUsuario: async (req, res) => {
        try {
            const { usuario_id } = req.params;
            const calificaciones = await BlockchainModel.obtenerCalificacionesUsuario(usuario_id);
            
            const promedio = calificaciones.length > 0 
                ? calificaciones.reduce((sum, c) => sum + c.puntuacion, 0) / calificaciones.length 
                : 5.0;

            res.json({
                usuario_id,
                promedio: Math.round(promedio * 10) / 10,
                total_calificaciones: calificaciones.length,
                confiable: promedio >= 4.0
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener reputación" });
        }
    }

};