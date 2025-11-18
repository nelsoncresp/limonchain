import { AnalisisModel } from "../models/analisis.model.js";
import { ContratosModel } from "../models/contratos.model.js";
import { LotesModel } from "../models/lotes.model.js";
import { BlockchainModel } from "../models/blockchain.model.js";
import { NotificacionService } from "../services/notificaciones.service.js"; 

export const AnalisisController = {

    pendientes: async (req, res) => {
        try {
            if (req.user.rol !== "ANALISTA") {
                return res.status(403).json({ error: "No autorizado" });
            }
            const contratos = await AnalisisModel.obtenerPendientes();
            res.json({ contratos });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener contratos pendientes" });
        }
    },

    detalle: async (req, res) => {
        try {
            if (req.user.rol !== "ANALISTA") {
                return res.status(403).json({ error: "No autorizado" });
            }
            const contrato = await AnalisisModel.obtenerDetalle(req.params.id);
            if (!contrato) return res.status(404).json({ error: "Contrato no encontrado" });
            res.json({ contrato });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener contrato" });
        }
    },

    aprobar: async (req, res) => {
        try {
            if (req.user.rol !== "ANALISTA") {
                return res.status(403).json({ error: "No autorizado" });
            }

            const analista_id = req.user.id;
            const contrato_id = req.params.id;

            // Actualizar contrato a APROBADO_ANALISTA
            const ok = await AnalisisModel.aprobar(contrato_id, analista_id);
            if (!ok) return res.status(404).json({ error: "Contrato no encontrado" });

            // Obtener contrato actualizado
            const contrato = await ContratosModel.obtenerContrato(contrato_id);
            if (!contrato) return res.status(404).json({ error: "Contrato no encontrado después de aprobar" });

            // Crear bloque en blockchain_blocks
            const bloque = await BlockchainModel.addBlock({
                contrato_id: contrato.id,
                lote_id: contrato.lote_id,
                agricultor_id: contrato.agricultor_id,
                comprador_id: contrato.comprador_id,
                analista_id: analista_id, // Usar el ID del analista que aprueba
                cantidad: contrato.cantidad,
                precio_unitario: contrato.precio_unitario,
                estado: "APROBADO_ANALISTA"
            });

            // Obtener nodos activos y crear confirmaciones pendientes
            const nodos = await BlockchainModel.getNodosActivos();
            for (const nodo of nodos) {
                await BlockchainModel.crearConfirmacion(bloque.id, nodo.id);
            }

            // Simular confirmación por nodos
            for (const nodo of nodos) {
                await BlockchainModel.confirmarBloque(bloque.id, nodo.id);
            }

            // Verificar consenso (ejemplo >= 66% de nodos)
            const confirmado = await BlockchainModel.verificarConsenso(bloque.id);
            if (confirmado) {
                await ContratosModel.cambiarEstado(contrato.id, "EN_BLOCKCHAIN");
            }

            // 🔔 AGREGAR AQUÍ LA NOTIFICACIÓN - después de aprobar el contrato
            await NotificacionService.notificarContratoAprobado(
                contrato.id,              // ID del contrato aprobado
                contrato.comprador_id,    // ID del comprador
                contrato.agricultor_nombre // Nombre del agricultor
            );

            return res.json({ ok: true, confirmado });

        } catch (err) {
            console.error("Error al aprobar contrato:", err);
            res.status(500).json({ error: "Error al aprobar contrato" });
        }
    },

    rechazar: async (req, res) => {
        try {
            if (req.user.rol !== "ANALISTA") {
                return res.status(403).json({ error: "No autorizado" });
            }

            const analista_id = req.user.id;
            const comentario = req.body.comentario || null;

            const ok = await AnalisisModel.rechazar(req.params.id, comentario, analista_id);
            if (!ok) return res.status(404).json({ error: "Contrato no encontrado" });

            // Opcional: devolver lote a DISPONIBLE
            const contrato = await ContratosModel.obtenerContrato(req.params.id);
            if (contrato) await LotesModel.cambiarEstado(contrato.lote_id, "DISPONIBLE");

            res.json({ ok: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al rechazar contrato" });
        }
    },
    todos: async (req, res) => {
        try {
          const contratos = await ContratosModel.obtenerTodos();
          res.json({ contratos });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Error obteniendo contratos" });
        }
      },      
      
};