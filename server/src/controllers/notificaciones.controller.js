
import { NotificacionesModel } from "../models/notificaciones.model.js";

export const NotificacionesController = {

    // Obtener todas las notificaciones del usuario
    obtenerMisNotificaciones: async (req, res) => {
        try {
            const usuario_id = req.user.id;
            const notificaciones = await NotificacionesModel.obtenerNotificacionesUsuario(usuario_id);
            
            res.json({ notificaciones });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener notificaciones" });
        }
    },

    // Contar notificaciones no leídas
    contarNoLeidas: async (req, res) => {
        try {
            const usuario_id = req.user.id;
            const total = await NotificacionesModel.contarNoLeidas(usuario_id);
            
            res.json({ total_no_leidas: total });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al contar notificaciones" });
        }
    },

    // Marcar una notificación como leída
    marcarComoLeida: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario_id = req.user.id;

            const exito = await NotificacionesModel.marcarComoLeida(id, usuario_id);
            
            if (!exito) {
                return res.status(404).json({ error: "Notificación no encontrada" });
            }

            res.json({ message: "Notificación marcada como leída" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al marcar notificación" });
        }
    },

    // Marcar TODAS las notificaciones como leídas
    marcarTodasComoLeidas: async (req, res) => {
        try {
            const usuario_id = req.user.id;
            const total = await NotificacionesModel.marcarTodasComoLeidas(usuario_id);
            
            res.json({ 
                message: "Todas las notificaciones marcadas como leídas",
                total_actualizadas: total 
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al marcar notificaciones" });
        }
    },

    // Eliminar una notificación
    eliminarNotificacion: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario_id = req.user.id;

            const exito = await NotificacionesModel.eliminarNotificacion(id, usuario_id);
            
            if (!exito) {
                return res.status(404).json({ error: "Notificación no encontrada" });
            }

            res.json({ message: "Notificación eliminada" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al eliminar notificación" });
        }
    }

};