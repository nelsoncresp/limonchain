import { TrazabilidadModel } from "../models/trazabilidad.model.js";

export const TrazabilidadController = {

    // Obtener eventos por lote
    obtenerPorLote: async (req, res) => {
        try {
            const { loteId } = req.params;
            
            console.log('🔍 Obteniendo trazabilidad para lote:', loteId);

            const eventos = await TrazabilidadModel.obtenerEventosPorLote(loteId);
            
            res.json(eventos);

        } catch (error) {
            console.error('❌ Error obteniendo trazabilidad por lote:', error);
            res.status(500).json({ 
                error: "Error al obtener trazabilidad",
                details: error.message 
            });
        }
    },

    // Obtener eventos por contrato
    obtenerPorContrato: async (req, res) => {
        try {
            const { contratoId } = req.params;
            
            console.log('🔍 Obteniendo trazabilidad para contrato:', contratoId);

            const eventos = await TrazabilidadModel.obtenerEventosPorContrato(contratoId);
            
            res.json(eventos);

        } catch (error) {
            console.error('❌ Error obteniendo trazabilidad por contrato:', error);
            res.status(500).json({ 
                error: "Error al obtener trazabilidad",
                details: error.message 
            });
        }
    },

    // Crear evento manualmente
    crearEvento: async (req, res) => {
        try {
            const { contrato_id, lote_id, evento, descripcion, hash_blockchain } = req.body;

            if (!evento) {
                return res.status(400).json({ error: "El evento es requerido" });
            }

            const nuevoEvento = await TrazabilidadModel.crearEvento({
                contrato_id,
                lote_id,
                evento,
                descripcion,
                hash_blockchain
            });

            res.status(201).json({ evento: nuevoEvento });

        } catch (error) {
            console.error(' Error creando evento de trazabilidad:', error);
            res.status(500).json({ 
                error: "Error al crear evento",
                details: error.message 
            });
        }
    }
};