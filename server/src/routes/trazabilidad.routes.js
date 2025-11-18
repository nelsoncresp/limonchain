import { Router } from "express";
import { TrazabilidadController } from "../controllers/trazabilidad.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas las rutas requieren autenticación
router.get("/lote/:loteId", auth, TrazabilidadController.obtenerPorLote);
router.get("/contrato/:contratoId", auth, TrazabilidadController.obtenerPorContrato);
router.post("/evento", auth, TrazabilidadController.crearEvento);

export default router;