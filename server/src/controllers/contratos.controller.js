import { ContratosModel } from "../models/contratos.model.js";
import { LotesModel } from "../models/lotes.model.js";
import { NotificacionService } from "../services/notificaciones.service.js"; 

export const ContratosController = {

    crearContrato: async (req, res) => {
        try {
            const comprador_id = req.user.id;

            if (req.user.rol !== "COMPRADOR") {
                return res.status(403).json({ error: "Solo compradores pueden crear contratos" });
            }

            const { lote_id, cantidad, precio_unitario, fecha_entrega } = req.body;

            const lote = await LotesModel.obtenerLoteSinUsuario(lote_id);
            if (!lote) {
                return res.status(404).json({ error: "El lote no existe" });
            }

            if (lote.agricultor_id === comprador_id) {
                return res.status(403).json({ error: "No puedes contratar tus propios lotes" });
            }

            if (lote.estado !== "DISPONIBLE") {
                return res.status(400).json({ error: "El lote no está disponible" });
            }

            const contrato = await ContratosModel.crear({
                lote_id,
                agricultor_id: lote.agricultor_id,
                comprador_id,
                cantidad,
                precio_unitario,
                fecha_entrega
            });

            await LotesModel.cambiarEstado(lote_id, "RESERVADO");

            // 🔔 AGREGAR AQUÍ LA NOTIFICACIÓN - después de crear el contrato exitosamente
            await NotificacionService.notificarNuevoContrato(
                contrato.id,           // ID del contrato creado
                lote.agricultor_id,    // ID del agricultor dueño del lote
                req.user.nombre,       // Nombre del comprador que creó el contrato
                lote.nombre            // Nombre del lote
            );

            return res.status(201).json({ contrato });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al crear contrato" });
        }
    },

    obtenerContrato: async (req, res) => {
        try {
            const { id } = req.params;
            const contrato = await ContratosModel.obtenerContrato(id);
            
            if (!contrato) {
                return res.status(404).json({ error: "Contrato no encontrado" });
            }

            res.json({ contrato });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener contrato" });
        }
    },

    listarContratos: async (req, res) => {
        try {
            let contratos;
            
            if (req.user.rol === "AGRICULTOR") {
                contratos = await ContratosModel.obtenerPorAgricultor(req.user.id);
            } else if (req.user.rol === "COMPRADOR") {
                contratos = await ContratosModel.obtenerPorComprador(req.user.id);
            } else if (req.user.rol === "ANALISTA") {
                contratos = await ContratosModel.obtenerTodos();
            } else if (req.user.rol === "ADMIN") {
                contratos = await ContratosModel.obtenerTodos();
            } else {
                return res.status(403).json({ error: "Rol no autorizado" });
            }

            res.json({ contratos });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al listar contratos" });
        }
    },

    obtenerMisContratos: async (req, res) => {
        try {
            const usuario_id = req.user.id;
            const rol = req.user.rol;
            
            let contratos;
            if (rol === "AGRICULTOR") {
                contratos = await ContratosModel.obtenerPorAgricultor(usuario_id);
            } else if (rol === "COMPRADOR") {
                contratos = await ContratosModel.obtenerPorComprador(usuario_id);
            } else {
                return res.status(403).json({ error: "Rol no autorizado para esta operación" });
            }

            res.json({ contratos });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener contratos" });
        }
    },
    getByAgricultor: async (req, res) => {
        try {
            const { agricultorId } = req.params;
            
            console.log('Obteniendo contratos para agricultor:', agricultorId);
            if (req.user.rol !== "ADMIN" && parseInt(req.user.id) !== parseInt(agricultorId)) {
                return res.status(403).json({ error: "No autorizado para ver estos contratos" });
            }

            const contratos = await ContratosModel.obtenerPorAgricultor(agricultorId);
            
            res.json(contratos);

        } catch (error) {
            console.error(' Error obteniendo contratos por agricultor:', error);
            res.status(500).json({ 
                error: "Error al obtener contratos",
                details: error.message 
            });
        }
    },

};