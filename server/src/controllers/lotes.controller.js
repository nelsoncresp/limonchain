// controllers/lotes.controller.js - VERSIÓN CORREGIDA
import { LotesModel } from "../models/lotes.model.js";

export const LotesController = {

    crear: async (req, res) => {
        try {
            const agricultor_id = req.user.id;

            const lote = await LotesModel.crearLote({
                agricultor_id,
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                cantidad: req.body.cantidad,
                unidad: req.body.unidad,
                calidad: req.body.calidad,
                fecha_cosecha: req.body.fecha_cosecha,
                foto_url: req.body.foto_url
            });

            res.status(201).json({ lote });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al crear lote" });
        }
    },

    misLotes: async (req, res) => {
        try {
            const agricultor_id = req.user.id;
            const lotes = await LotesModel.obtenerLotesPorUsuario(agricultor_id);
            res.json({ lotes });

        } catch (error) {
            res.status(500).json({ error: "Error al obtener lotes" });
        }
    },

    detalle: async (req, res) => {
        try {
            console.log('🔍 Obteniendo lote:', req.params.id, 'Usuario:', req.user.id, 'Rol:', req.user.rol);
            
            const { id } = req.params;
            let lote;

            // Si es ADMIN, puede ver cualquier lote
            if (req.user.rol === "ADMIN") {
                console.log('👑 ADMIN accediendo a lote');
                lote = await LotesModel.obtenerLoteSinRestriccion(id);
            } 
            // Si es AGRICULTOR, solo puede ver sus lotes
            else if (req.user.rol === "AGRICULTOR") {
                const agricultor_id = req.user.id;
                console.log('🌱 AGRICULTOR accediendo a su lote');
                lote = await LotesModel.obtenerLoteById(id, agricultor_id);
            }
            // Otros roles no pueden ver lotes individuales
            else {
                console.log('🚫 Rol no autorizado:', req.user.rol);
                return res.status(403).json({ error: "No autorizado para ver lotes" });
            }

            console.log('📦 Lote encontrado:', lote ? 'SÍ' : 'NO');

            if (!lote) {
                return res.status(404).json({ error: "Lote no encontrado" });
            }

            res.json({ lote });

        } catch (error) {
            console.error('❌ Error en detalle lote:', error);
            console.error('📝 Stack:', error.stack);
            res.status(500).json({ error: "Error al obtener lote" });
        }
    },

    actualizar: async (req, res) => {
        try {
            const agricultor_id = req.user.id;

            const actualizado = await LotesModel.actualizarLote(
                req.params.id,
                agricultor_id,
                req.body
            );

            if (!actualizado) return res.status(404).json({ error: "Lote no encontrado" });

            res.json({ ok: true });

        } catch (error) {
            res.status(500).json({ error: "Error al actualizar lote" });
        }
    },

    eliminar: async (req, res) => {
        try {
            const agricultor_id = req.user.id;

            const eliminado = await LotesModel.eliminarLote(
                req.params.id,
                agricultor_id
            );

            if (!eliminado) return res.status(404).json({ error: "Lote no encontrado" });

            res.json({ ok: true });

        } catch (error) {
            res.status(500).json({ error: "Error al eliminar lote" });
        }
    },

    lotesDisponibles: async (req, res) => {
        try {
            // Solo compradores pueden ver lotes disponibles
            if (req.user.rol !== "COMPRADOR") {
                return res.status(403).json({ error: "Solo compradores pueden ver lotes disponibles" });
            }

            const lotes = await LotesModel.obtenerDisponibles();

            res.json({ lotes });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener lotes disponibles" });
        }
    }

};