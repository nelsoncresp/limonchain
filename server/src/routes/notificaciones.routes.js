// routes/notificaciones.routes.js
import { Router } from "express";
import { NotificacionesController } from "../controllers/notificaciones.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(auth);

// Obtener notificaciones del usuario
router.get("/", NotificacionesController.obtenerMisNotificaciones);

// Contar notificaciones no leídas
router.get("/contar-no-leidas", NotificacionesController.contarNoLeidas);

// Marcar una notificación como leída
router.put("/:id/leer", NotificacionesController.marcarComoLeida);

// Marcar TODAS como leídas
router.put("/marcar-todas-leidas", NotificacionesController.marcarTodasComoLeidas);

// Eliminar una notificación
router.delete("/:id", NotificacionesController.eliminarNotificacion);

export default router;