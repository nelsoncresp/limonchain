import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import {
  contratosDetalle,
  blockchainDetalle,
  actividadDiaria,
  lotesDetalle
} from '../controllers/estadisticas.controller.js';

const router = Router();

// Middleware: requiere ADMIN
const requireAdmin = (req, res, next) => {
  if (req.user.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'Se requieren privilegios de administrador' });
  }
  next();
};

// TODAS ESTAS RUTAS requieren autenticación y ser ADMIN
router.use(auth, requireAdmin);

// Gestión de usuarios
router.post("/usuarios", AdminController.crearUsuario);
router.get("/usuarios", AdminController.listarUsuarios);
router.get("/usuarios/estadisticas", AdminController.estadisticasUsuarios);
router.get("/usuarios/:id", AdminController.obtenerUsuario);
router.put("/usuarios/:id", AdminController.actualizarUsuario);
router.delete("/usuarios/:id", AdminController.eliminarUsuario);

// Estadísticas nuevas
router.get('/estadisticas/contratos-detalle', contratosDetalle);
router.get('/estadisticas/blockchain-detalle', blockchainDetalle);
router.get('/estadisticas/actividad', actividadDiaria);
router.get('/estadisticas/lotes-detalle', lotesDetalle);

export default router;
