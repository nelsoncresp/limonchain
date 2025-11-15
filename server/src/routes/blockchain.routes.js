import { Router } from "express";
import { BlockchainModel } from "../models/blockchain.model.js";
import { auth } from "../middlewares/auth.middleware.js";
import { pool } from "../config/db.js";

const router = Router();

// GET /api/blockchain → lista todos los bloques
router.get("/", auth, async (req, res) => {
    const blocks = await BlockchainModel.getAllBlocks();
    res.json({ blocks });
});
// POST /api/blockchain/reparar → reparar contratos antiguos (solo admin)
router.post("/reparar", auth, async (req, res) => {
    try {
        if (req.user.rol !== "ADMIN") {
            return res.status(403).json({ error: "Solo administradores pueden ejecutar reparación" });
        }
        
        // Lógica de reparación
        const contratosReparados = await repararContratos();
        
        res.json({ 
            ok: true, 
            message: "Reparación completada",
            contratos_reparados: contratosReparados 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en reparación" });
    }
});

// Función de reparación
async function repararContratos() {
    try {
        console.log('🔧 Reparando contratos...');
        
        // Actualizar contratos que tienen bloques pero no están en EN_BLOCKCHAIN
        const [result] = await pool.query(`
            UPDATE contratos c
            SET c.estado = 'EN_BLOCKCHAIN'
            WHERE c.estado = 'APROBADO_ANALISTA' 
            AND EXISTS (
                SELECT 1 FROM blockchain_blocks bb 
                WHERE bb.contrato_id = c.id
            )
        `);
        
        console.log(`✅ Contratos reparados: ${result.affectedRows}`);
        return result.affectedRows;
        
    } catch (error) {
        console.error('❌ Error en reparación:', error);
        throw error;
    }
}

export default router;
