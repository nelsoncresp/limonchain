import { pool } from "../config/db.js";

export const TrazabilidadModel = {
    
    // Obtener eventos por lote
    obtenerEventosPorLote: async (loteId) => {
        console.log('📋 MODELO: Buscando eventos para lote ID:', loteId);
        
        const sql = `
            SELECT * FROM trazabilidad 
            WHERE lote_id = ? 
            ORDER BY fecha DESC
        `;
        
        try {
            const [rows] = await pool.query(sql, [loteId]);
            console.log('📋 MODELO: Eventos encontrados para lote', loteId, ':', rows.length);
            console.log('📋 MODELO: Detalles eventos:', rows);
            return rows;
        } catch (error) {
            console.error('❌ MODELO: Error en obtenerEventosPorLote:', error);
            throw error;
        }
    },

    // Obtener eventos por contrato
    obtenerEventosPorContrato: async (contratoId) => {
        console.log('📋 MODELO: Buscando eventos para contrato ID:', contratoId);
        
        const sql = `
            SELECT * FROM trazabilidad 
            WHERE contrato_id = ? 
            ORDER BY fecha DESC
        `;
        
        try {
            const [rows] = await pool.query(sql, [contratoId]);
            console.log('📋 MODELO: Eventos encontrados para contrato', contratoId, ':', rows.length);
            console.log('📋 MODELO: Detalles eventos:', rows);
            return rows;
        } catch (error) {
            console.error('❌ MODELO: Error en obtenerEventosPorContrato:', error);
            throw error;
        }
    },

    // Resto de métodos permanecen igual...
    crearEvento: async (data) => {
        const sql = `
            INSERT INTO trazabilidad 
            (contrato_id, lote_id, evento, descripcion, hash_blockchain)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(sql, [
            data.contrato_id || null,
            data.lote_id || null,
            data.evento,
            data.descripcion || null,
            data.hash_blockchain || null
        ]);

        return { id: result.insertId, ...data };
    },

    obtenerTrazabilidadCompletaLote: async (loteId) => {
        const sql = `
            SELECT 
                t.*,
                'EVENTO_LOTE' as tipo
            FROM trazabilidad t
            WHERE t.lote_id = ?
            
            UNION ALL
            
            SELECT 
                t.*,
                'EVENTO_CONTRATO' as tipo
            FROM trazabilidad t
            INNER JOIN contratos c ON t.contrato_id = c.id
            WHERE c.lote_id = ?
            
            ORDER BY fecha DESC
        `;
        
        const [rows] = await pool.query(sql, [loteId, loteId]);
        return rows;
    },

    eventosSistema: {
        LOTE_CREADO: "Lote creado",
        LOTE_ACTUALIZADO: "Lote actualizado",
        CONTRATO_CREADO: "Contrato creado",
        CONTRATO_APROBADO_ANALISTA: "Contrato aprobado por analista",
        CONTRATO_RECHAZADO_ANALISTA: "Contrato rechazado por analista",
        CONTRATO_EN_BLOCKCHAIN: "Contrato registrado en blockchain",
        CONTRATO_ACEPTADO_COMPRADOR: "Contrato aceptado por comprador",
        TRANSPORTE_ASIGNADO: "Transporte asignado",
        EN_RUTA: "Producto en ruta de transporte",
        ENTREGA_COMPLETADA: "Entrega completada",
        CALIDAD_VERIFICADA: "Calidad verificada",
        PAGO_REALIZADO: "Pago realizado",
        INCIDENTE_REPORTADO: "Incidente reportado"
    }
};