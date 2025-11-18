import { TrazabilidadModel } from "../models/trazabilidad.model.js";
import { BlockchainModel } from "../models/blockchain.model.js";

export const TrazabilidadService = {
    
    // Registrar evento automáticamente con blockchain
    registrarEvento: async (data) => {
        try {
            // Registrar en tabla de trazabilidad
            const evento = await TrazabilidadModel.crearEvento(data);
            
            console.log(`📝 Evento registrado: ${data.evento} - ID: ${evento.id}`);
            return evento;

        } catch (error) {
            console.error('❌ Error registrando evento automático:', error);
            throw error;
        }
    },

    // Registrar evento CRÍTICO en blockchain
    registrarEventoBlockchain: async (data) => {
        try {
            // Registrar en trazabilidad normal
            const evento = await TrazabilidadService.registrarEvento(data);
            
            // Para eventos críticos, también registrar en blockchain
            if (data.contrato_id && this.esEventoCritico(data.evento)) {
                await TrazabilidadService.registrarEnBlockchain(data);
            }
            
            return evento;

        } catch (error) {
            console.error('❌ Error registrando evento blockchain:', error);
            throw error;
        }
    },

    // Determinar si un evento es crítico para blockchain
    esEventoCritico: (evento) => {
        const eventosCriticos = [
            TrazabilidadModel.eventosSistema.CONTRATO_CREADO,
            TrazabilidadModel.eventosSistema.CONTRATO_APROBADO_ANALISTA,
            TrazabilidadModel.eventosSistema.CONTRATO_EN_BLOCKCHAIN,
            TrazabilidadModel.eventosSistema.ENTREGA_COMPLETADA
        ];
        return eventosCriticos.includes(evento);
    },

    // Registrar en blockchain
    registrarEnBlockchain: async (data) => {
        try {
            // Obtener información del contrato para el bloque
            const [contratos] = await pool.query(
                `SELECT c.*, l.agricultor_id, l.nombre as lote_nombre 
                 FROM contratos c 
                 JOIN lotes l ON c.lote_id = l.id 
                 WHERE c.id = ?`,
                [data.contrato_id]
            );
            
            if (contratos.length === 0) {
                throw new Error('Contrato no encontrado');
            }

            const contrato = contratos[0];
            
            // Crear bloque en blockchain
            const bloqueData = {
                contrato_id: contrato.id,
                lote_id: contrato.lote_id,
                agricultor_id: contrato.agricultor_id,
                comprador_id: contrato.comprador_id,
                analista_id: contrato.analista_id,
                cantidad: contrato.cantidad,
                precio_unitario: contrato.precio_unitario,
                estado: contrato.estado,
                evento_trazabilidad: data.evento,
                descripcion_evento: data.descripcion
            };

            const bloque = await BlockchainModel.addBlock(bloqueData);
            
            console.log(`⛓️ Evento registrado en blockchain: ${data.evento} - Hash: ${bloque.hash}`);
            
            // Actualizar hash en trazabilidad
            await TrazabilidadModel.actualizarHashBlockchain(data.contrato_id, bloque.hash);
            
            return bloque;

        } catch (error) {
            console.error('❌ Error registrando en blockchain:', error);
            throw error;
        }
    },

    // Eventos automáticos del sistema
    eventosAutomaticos: {
        
        // Cuando se crea un lote
        onLoteCreado: async (loteId, loteData) => {
            return await TrazabilidadService.registrarEvento({
                lote_id: loteId,
                evento: TrazabilidadModel.eventosSistema.LOTE_CREADO,
                descripcion: `Lote "${loteData.nombre}" creado con ${loteData.cantidad} ${loteData.unidad}`
            });
        },

        // Cuando se actualiza un lote
        onLoteActualizado: async (loteId, cambios) => {
            return await TrazabilidadService.registrarEvento({
                lote_id: loteId,
                evento: TrazabilidadModel.eventosSistema.LOTE_ACTUALIZADO,
                descripcion: `Lote actualizado: ${Object.keys(cambios).join(', ')}`
            });
        },

        // Cuando se crea un contrato (CRÍTICO - va a blockchain)
        onContratoCreado: async (contratoId, contratoData) => {
            return await TrazabilidadService.registrarEventoBlockchain({
                contrato_id: contratoId,
                lote_id: contratoData.lote_id,
                evento: TrazabilidadModel.eventosSistema.CONTRATO_CREADO,
                descripcion: `Contrato creado para ${contratoData.cantidad} unidades a $${contratoData.precio_unitario} c/u`
            });
        },

        // Cuando un analista aprueba un contrato (CRÍTICO - va a blockchain)
        onContratoAprobado: async (contratoId, analistaId, comentario) => {
            return await TrazabilidadService.registrarEventoBlockchain({
                contrato_id: contratoId,
                evento: TrazabilidadModel.eventosSistema.CONTRATO_APROBADO_ANALISTA,
                descripcion: `Contrato aprobado por analista ${analistaId}. ${comentario || 'Sin comentarios'}`
            });
        },

        // Cuando se registra en blockchain (CRÍTICO - va a blockchain)
        onBlockchainRegistrado: async (contratoId, hash) => {
            return await TrazabilidadService.registrarEventoBlockchain({
                contrato_id: contratoId,
                evento: TrazabilidadModel.eventosSistema.CONTRATO_EN_BLOCKCHAIN,
                descripcion: "Contrato registrado en la blockchain",
                hash_blockchain: hash
            });
        },

        // Cuando se asigna transporte
        onTransporteAsignado: async (contratoId, transportistaId) => {
            return await TrazabilidadService.registrarEvento({
                contrato_id: contratoId,
                evento: TrazabilidadModel.eventosSistema.TRANSPORTE_ASIGNADO,
                descripcion: `Transporte asignado al transportista ${transportistaId}`
            });
        },

        // Cuando el producto está en ruta
        onEnRuta: async (contratoId) => {
            return await TrazabilidadService.registrarEvento({
                contrato_id: contratoId,
                evento: TrazabilidadModel.eventosSistema.EN_RUTA,
                descripcion: "Producto en camino al destino"
            });
        },

        // Cuando se completa la entrega (CRÍTICO - va a blockchain)
        onEntregaCompletada: async (contratoId, evidenciaUrl) => {
            return await TrazabilidadService.registrarEventoBlockchain({
                contrato_id: contratoId,
                evento: TrazabilidadModel.eventosSistema.ENTREGA_COMPLETADA,
                descripcion: `Entrega completada. Evidencia: ${evidenciaUrl || 'No disponible'}`
            });
        },

        // Cuando hay un incidente
        onIncidenteReportado: async (contratoId, descripcionIncidente) => {
            return await TrazabilidadService.registrarEvento({
                contrato_id: contratoId,
                evento: TrazabilidadModel.eventosSistema.INCIDENTE_REPORTADO,
                descripcion: `Incidente reportado: ${descripcionIncidente}`
            });
        }
    }
};