import { Router } from "express";
import { LotesController } from "../controllers/lotes.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

// SOLO Agricultores
router.post("/", auth, LotesController.crear);
router.get("/", auth, LotesController.misLotes);
router.get("/disponibles", auth, LotesController.lotesDisponibles);

router.get("/:id", auth, LotesController.detalle);
router.put("/:id", auth, LotesController.actualizar);
router.delete("/:id", auth, LotesController.eliminar);


export default router;
