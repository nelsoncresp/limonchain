import { Router } from "express";
import { TransporteController } from "../controllers/transporte.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { pool } from "../config/db.js";

const router = Router();

// Asignar transporte (solo ADMIN)
router.post("/asignar", auth, TransporteController.asignarTransporte);

// Transportista ve sus transportes
router.get("/mis-transportes", auth, TransporteController.misTransportes);

// Actualizar estado (solo transportista)
router.put("/:id/estado", auth, TransporteController.actualizarEstado);

// Ver todos los transportes (solo ADMIN)
router.get("/", auth, TransporteController.obtenerTodos);

export default router;