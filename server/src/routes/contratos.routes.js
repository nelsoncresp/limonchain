import { Router } from "express";
import { ContratosController } from "../controllers/contratos.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

// Crear contrato (solo compradores)
router.post("/", auth, ContratosController.crearContrato);


// Obtener contrato específico
router.get("/:id", auth, ContratosController.obtenerContrato);

// Listar contratos (según rol)
router.get("/", auth, ContratosController.listarContratos);

// Mis contratos (agricultor/comprador)
router.get("/mis-contratos", auth, ContratosController.obtenerMisContratos);

export default router;