import { NotificacionesModel } from "../models/notificaciones.model.js";

export const NotificacionService = {
    
    notificarNuevoContrato: async (contrato_id, agricultor_id, comprador_nombre) => {
        await NotificacionesModel.crearNotificacion(
            agricultor_id,
            'CONTRATO_NUEVO',
            '¡Nuevo contrato recibido! 🎉',
            `El comprador ${comprador_nombre} quiere adquirir tu lote. Revisa los detalles del contrato.`,
            contrato_id
        );
    },

    notificarContratoAprobado: async (contrato_id, comprador_id, agricultor_nombre) => {
        await NotificacionesModel.crearNotificacion(
            comprador_id,
            'CONTRATO_APROBADO', 
            'Contrato aprobado ✅',
            `Tu contrato con ${agricultor_nombre} ha sido aprobado. El lote está en camino.`,
            contrato_id
        );
    },

    notificarTransporteAsignado: async (transporte_id, transportista_id, detalles) => {
        await NotificacionesModel.crearNotificacion(
            transportista_id,
            'TRANSPORTE_ASIGNADO',
            'Nuevo transporte asignado 🚚',
            `Tienes un nuevo transporte asignado: ${detalles}`,
            transporte_id
        );
    },

    notificarEntregaCompletada: async (contrato_id, agricultor_id, comprador_id) => {
        // Notificar al agricultor
        await NotificacionesModel.crearNotificacion(
            agricultor_id,
            'ENTREGA_COMPLETADA',
            'Entrega completada 📦',
            'Tu lote ha sido entregado exitosamente al comprador.',
            contrato_id
        );

        // Notificar al comprador  
        await NotificacionesModel.crearNotificacion(
            comprador_id,
            'ENTREGA_COMPLETADA',
            'Pedido entregado 🎊',
            'Tu pedido ha sido entregado. ¡Gracias por tu compra!',
            contrato_id
        );
    }

};