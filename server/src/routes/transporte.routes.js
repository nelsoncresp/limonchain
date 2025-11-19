import { Router } from "express";
import { TransporteController } from "../controllers/transporte.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

// ADMIN asigna transporte
router.post("/asignar", auth, TransporteController.asignarTransporte);

// Transportista ve sus rutas
router.get("/my", auth, TransporteController.my);

// Transportista reporta entrega
router.post("/report", auth, TransporteController.report);

// Transportista actualiza estado
router.put("/:id/status", auth, TransporteController.updateStatus);

// ADMIN ve todos
router.get("/", auth, TransporteController.obtenerTodos);

export default router;
