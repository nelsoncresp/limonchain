import { TransporteModel } from '../models/transporte.model.js';
import { ContratosModel } from '../models/contratos.model.js';
import { LotesModel } from '../models/lotes.model.js';
import { pool } from "../config/db.js";

export const TransporteController = {

    // Asignar transporte a un contrato (solo ADMIN)
    asignarTransporte: async (req, res) => {
        try {
            if (req.user.rol !== 'ADMIN') {
                return res.status(403).json({ error: 'Solo administradores pueden asignar transportes' });
            }

            const { contrato_id, transportista_id, ruta } = req.body;

            const contrato = await ContratosModel.obtenerContrato(contrato_id);
            if (!contrato) {
                return res.status(404).json({ error: 'Contrato no encontrado' });
            }

            if (contrato.estado !== 'EN_BLOCKCHAIN') {
                return res.status(400).json({ 
                    error: 'El contrato debe estar en blockchain para asignar transporte' 
                });
            }

            const transporteExistente = await TransporteModel.obtenerPorContrato(contrato_id);
            if (transporteExistente) {
                return res.status(400).json({ error: 'Este contrato ya tiene transporte asignado' });
            }

            const transporte_id = await TransporteModel.crearTransporte(contrato_id, transportista_id, ruta);
            
            await ContratosModel.cambiarEstado(contrato_id, 'EN_TRANSPORTE');
            await LotesModel.cambiarEstado(contrato.lote_id, 'EN_TRANSPORTE');

            res.status(201).json({
                message: 'Transporte asignado exitosamente',
                transporte_id: transporte_id
            });

        } catch (err) {
            console.error('Error en asignarTransporte:', err);
            res.status(500).json({ error: 'Error al asignar transporte' });
        }
    },

    // Transportista ve sus rutas
    my: async (req, res) => {
        try {
            if (req.user.rol !== 'TRANSPORTISTA') {
                return res.status(403).json({ error: 'Solo transportistas pueden ver sus rutas' });
            }

            const transportes = await TransporteModel.obtenerPorTransportista(req.user.id);
            res.json({ transportes });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener rutas' });
        }
    },

    // Reportar entrega (agrega evidencia)
    report: async (req, res) => {
        try {
            if (req.user.rol !== 'TRANSPORTISTA') {
                return res.status(403).json({ error: 'Solo transportistas pueden reportar entregas' });
            }

            const { transporte_id, evidencia_url } = req.body;

            const transporte = await TransporteModel.obtenerPorId(transporte_id);
            if (!transporte) {
                return res.status(404).json({ error: 'Transporte no encontrado' });
            }

            if (transporte.transportista_id !== req.user.id) {
                return res.status(403).json({ error: 'No puedes reportar este transporte' });
            }

            await TransporteModel.actualizarEstado(transporte_id, 'ENTREGADO', evidencia_url);

            await ContratosModel.cambiarEstado(transporte.contrato_id, 'ENTREGADO');
            const contrato = await ContratosModel.obtenerContrato(transporte.contrato_id);
            await LotesModel.cambiarEstado(contrato.lote_id, 'ENTREGADO');

            res.json({
                message: "Entrega reportada con éxito",
                evidencia_url
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al reportar entrega' });
        }
    },

    // Actualizar estado del transporte
    updateStatus: async (req, res) => {
        try {
            if (req.user.rol !== 'TRANSPORTISTA') {
                return res.status(403).json({ error: 'Solo transportistas pueden actualizar estados' });
            }

            const { id } = req.params;
            const { estado, evidencia_url } = req.body;

            const estadosPermitidos = ['EN_RUTA', 'ENTREGADO', 'FALLIDO'];
            if (!estadosPermitidos.includes(estado)) {
                return res.status(400).json({ error: 'Estado no válido' });
            }

            const transporte = await TransporteModel.obtenerPorId(id);
            if (!transporte) {
                return res.status(404).json({ error: 'Transporte no encontrado' });
            }

            if (transporte.transportista_id !== req.user.id) {
                return res.status(403).json({ error: 'No tienes permisos para este transporte' });
            }

            await TransporteModel.actualizarEstado(id, estado, evidencia_url);

            if (estado === 'ENTREGADO') {
                await ContratosModel.cambiarEstado(transporte.contrato_id, 'ENTREGADO');
                const contrato = await ContratosModel.obtenerContrato(transporte.contrato_id);
                await LotesModel.cambiarEstado(contrato.lote_id, 'ENTREGADO');
            }

            res.json({ 
                message: 'Estado actualizado exitosamente',
                nuevo_estado: estado
            });

        } catch (err) {
            console.error('Error en updateStatus:', err);
            res.status(500).json({ error: 'Error al actualizar estado' });
        }
    },

    // ADMIN — obtener todos
    obtenerTodos: async (req, res) => {
        try {
            if (req.user.rol !== 'ADMIN') {
                return res.status(403).json({ error: 'Solo administradores pueden ver todos los transportes' });
            }

            const [transportes] = await pool.query(`
                SELECT t.*, u.nombre as transportista_nombre, 
                       c.id as contrato_id, l.nombre as lote_nombre
                FROM transporte t
                JOIN users u ON t.transportista_id = u.id
                JOIN contratos c ON t.contrato_id = c.id
                JOIN lotes l ON c.lote_id = l.id
                ORDER BY t.fecha_asignacion DESC
            `);

            res.json({ transportes });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener transportes' });
        }
    }

};
