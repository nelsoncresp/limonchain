import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
//imports routes by model n controllers
import lotesRoutes from "./routes/lotes.routes.js";
import contratosRoutes from "./routes/contratos.routes.js";
import analisisRoutes from "./routes/analisis.routes.js";
import blockchainRoutes from "./routes/blockchain.routes.js";
import adminRoutes from './routes/admin.routes.js'
import transporteRoutes from './routes/transporte.routes.js';

import notificacionesRoutes from './routes/notificaciones.routes.js';


import { testConnection } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import { setupSimpleDocumentation } from './utils/autoDocumentation.js'


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limit básico
const limiter = rateLimit({
  windowMs: 60000,
  max: 100
});
app.use(limiter);

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/lotes", lotesRoutes);
app.use("/api/contratos", contratosRoutes);
app.use("/api/analisis-contratos", analisisRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/transporte", transporteRoutes);
app.use("/api/notificaciones", notificacionesRoutes);

// Healthcheck
app.get('/health', (req, res) => res.json({ ok: true }));

setupSimpleDocumentation(app);
// Manejo global de errores
app.use(errorMiddleware);


// Inicio del server
const PORT = process.env.PORT || 4000;

await testConnection();

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
  console.log(`📚 Documentación automática disponible en:`);
  console.log(`   📄 HTML: http://localhost:${PORT}/api/docs`);
  console.log(`   🔗 JSON: http://localhost:${PORT}/api/docs/json`);
});
