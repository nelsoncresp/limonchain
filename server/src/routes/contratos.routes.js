import { Router } from "express";
import { ContratosController } from "../controllers/contratos.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/agricultor/:agricultorId", auth, ContratosController.getByAgricultor);

router.post("/", auth, ContratosController.crearContrato);

router.get("/:id", auth, ContratosController.obtenerContrato);

// Listar contratos (según rol)
router.get("/", auth, ContratosController.listarContratos);

// Mis contratos (agricultor/comprador)
router.get("/mis-contratos", auth, ContratosController.obtenerMisContratos);


export default router;