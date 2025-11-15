// routes/admin.js
import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { auth } from "../middlewares/auth.middleware.js";


const router = Router();

// Middleware que verifica que sea ADMIN
const requireAdmin = (req, res, next) => {
  if (req.user.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'Se requieren privilegios de administrador' });
  }
  next();
};

// Todas estas rutas requieren ser ADMIN
router.use(auth, requireAdmin);

// Gestión de usuarios
router.post("/usuarios", AdminController.crearUsuario);
router.get("/usuarios", AdminController.listarUsuarios);
router.get("/usuarios/estadisticas", AdminController.estadisticasUsuarios);
router.get("/usuarios/:id", AdminController.obtenerUsuario);
router.put("/usuarios/:id", AdminController.actualizarUsuario);
router.delete("/usuarios/:id", AdminController.eliminarUsuario);

export default router;