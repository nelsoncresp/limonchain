// controllers/lotes.controller.js
import { LotesModel } from "../models/lotes.model.js";
import { TrazabilidadService } from "../services/trazabilidad.service.js";

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

            // 🔥 REGISTRAR EVENTO DE TRAZABILIDAD AUTOMÁTICO
            try {
                await TrazabilidadService.eventosAutomaticos.onLoteCreado(lote.id, lote);
                console.log(` Trazabilidad: Lote ${lote.id} creado por agricultor ${agricultor_id}`);
            } catch (trazabilidadError) {
                console.error(' Error en trazabilidad (no crítico):', trazabilidadError);
                // No falla la creación del lote por error en trazabilidad
            }

            res.status(201).json({ lote });

        } catch (error) {
            console.error(' Error al crear lote:', error);
            res.status(500).json({ error: "Error al crear lote" });
        }
    },

    misLotes: async (req, res) => {
        try {
            const agricultor_id = req.user.id;
            const lotes = await LotesModel.obtenerLotesPorUsuario(agricultor_id);
            res.json({ lotes });

        } catch (error) {
            console.error(' Error al obtener lotes:', error);
            res.status(500).json({ error: "Error al obtener lotes" });
        }
    },

    detalle: async (req, res) => {
        try {
            console.log(' Obteniendo lote:', req.params.id, 'Usuario:', req.user.id, 'Rol:', req.user.rol);

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
            console.error(' Error en detalle lote:', error);
            console.error(' Stack:', error.stack);
            res.status(500).json({ error: "Error al obtener lote" });
        }
    },

    actualizar: async (req, res) => {
        try {
            const agricultor_id = req.user.id;
            const loteId = req.params.id;

            // Obtener lote actual antes de la actualización para comparar cambios
            const loteActual = await LotesModel.obtenerLoteById(loteId, agricultor_id);
            
            if (!loteActual) {
                return res.status(404).json({ error: "Lote no encontrado" });
            }

            const actualizado = await LotesModel.actualizarLote(
                loteId,
                agricultor_id,
                req.body
            );

            if (!actualizado) {
                return res.status(404).json({ error: "Lote no encontrado" });
            }

            // 🔥 REGISTRAR EVENTO DE TRAZABILIDAD AUTOMÁTICO
            try {
                const cambios = obtenerCambiosLote(loteActual, req.body);
                if (Object.keys(cambios).length > 0) {
                    await TrazabilidadService.eventosAutomaticos.onLoteActualizado(loteId, cambios);
                    console.log(` Trazabilidad: Lote ${loteId} actualizado - Cambios: ${Object.keys(cambios).join(', ')}`);
                }
            } catch (trazabilidadError) {
                console.error(' Error en trazabilidad (no crítico):', trazabilidadError);
                // No falla la actualización por error en trazabilidad
            }

            res.json({ ok: true });

        } catch (error) {
            console.error(' Error al actualizar lote:', error);
            res.status(500).json({ error: "Error al actualizar lote" });
        }
    },

    eliminar: async (req, res) => {
        try {
            const agricultor_id = req.user.id;
            const loteId = req.params.id;

            // Obtener lote antes de eliminar para trazabilidad
            const lote = await LotesModel.obtenerLoteById(loteId, agricultor_id);
            
            if (!lote) {
                return res.status(404).json({ error: "Lote no encontrado" });
            }

            const eliminado = await LotesModel.eliminarLote(loteId, agricultor_id);

            if (!eliminado) {
                return res.status(404).json({ error: "Lote no encontrado" });
            }

            // 🔥 REGISTRAR EVENTO DE TRAZABILIDAD AUTOMÁTICO
            try {
                await TrazabilidadService.registrarEvento({
                    lote_id: loteId,
                    evento: "Lote eliminado",
                    descripcion: `Lote "${lote.nombre}" eliminado por el agricultor`
                });
                console.log(` Trazabilidad: Lote ${loteId} eliminado por agricultor ${agricultor_id}`);
            } catch (trazabilidadError) {
                console.error(' Error en trazabilidad (no crítico):', trazabilidadError);
                // No falla la eliminación por error en trazabilidad
            }

            res.json({ ok: true });

        } catch (error) {
            console.error(' Error al eliminar lote:', error);
            res.status(500).json({ error: "Error al eliminar lote" });
        }
    },

    lotesDisponibles: async (req, res) => {
        try {
            const rolesPermitidos = ["COMPRADOR", "ADMIN"];

            if (!rolesPermitidos.includes(req.user.rol)) {
                return res.status(403).json({ error: "No autorizado" });
            }

            const lotes = await LotesModel.obtenerDisponibles();

            res.json({ lotes });

        } catch (error) {
            console.error(' Error al obtener lotes disponibles:', error);
            res.status(500).json({ error: "Error al obtener lotes disponibles" });
        }
    }

};

// 🔧 FUNCIÓN AUXILIAR: Detectar cambios en la actualización del lote
function obtenerCambiosLote(loteActual, nuevosDatos) {
    const cambios = {};
    
    const campos = ['nombre', 'descripcion', 'cantidad', 'unidad', 'calidad', 'fecha_cosecha', 'foto_url'];
    
    campos.forEach(campo => {
        if (nuevosDatos[campo] !== undefined && nuevosDatos[campo] !== loteActual[campo]) {
            cambios[campo] = {
                anterior: loteActual[campo],
                nuevo: nuevosDatos[campo]
            };
        }
    });
    
    return cambios;
}