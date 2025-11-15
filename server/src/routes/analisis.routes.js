import { Router } from "express";
import { AnalisisController } from "../controllers/analisis.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/pendientes", auth, AnalisisController.pendientes);
router.get("/detalle/:id", auth, AnalisisController.detalle);
router.put("/:id/aprobar", auth, AnalisisController.aprobar);
router.put("/:id/rechazar", auth, AnalisisController.rechazar);

export default router;
