import { pool } from "../config/db.js";

async function diagnosticarTrazabilidad() {
    console.log('🔍 INICIANDO DIAGNÓSTICO DE TRAZABILIDAD\n');

    try {
        // 1. Verificar estructura de la tabla trazabilidad
        console.log('1. 📋 ESTRUCTURA DE TABLA TRAZABILIDAD:');
        const [estructura] = await pool.query(`DESCRIBE trazabilidad`);
        console.table(estructura);

        // 2. Verificar si hay datos en trazabilidad
        console.log('\n2. 📊 DATOS EXISTENTES EN TRAZABILIDAD:');
        const [trazabilidadData] = await pool.query(`SELECT * FROM trazabilidad ORDER BY id DESC LIMIT 10`);
        
        if (trazabilidadData.length === 0) {
            console.log('❌ No hay datos en la tabla trazabilidad');
        } else {
            console.table(trazabilidadData);
        }

        // 3. Verificar lotes existentes
        console.log('\n3. 🌱 LOTES EXISTENTES:');
        const [lotes] = await pool.query(`SELECT id, nombre, agricultor_id, estado FROM lotes ORDER BY id DESC LIMIT 10`);
        console.table(lotes);

        // 4. Verificar contratos existentes
        console.log('\n4. 📃 CONTRATOS EXISTENTES:');
        const [contratos] = await pool.query(`SELECT id, lote_id, agricultor_id, comprador_id, estado FROM contratos ORDER BY id DESC LIMIT 10`);
        console.table(contratos);

        // 5. Verificar usuarios
        console.log('\n5. 👥 USUARIOS EXISTENTES:');
        const [usuarios] = await pool.query(`SELECT id, nombre, email, rol FROM users WHERE rol IN ('AGRICULTOR', 'COMPRADOR', 'ANALISTA') ORDER BY id DESC LIMIT 10`);
        console.table(usuarios);

        console.log('\n✅ DIAGNÓSTICO COMPLETADO');

    } catch (error) {
        console.error('❌ ERROR EN DIAGNÓSTICO:', error);
    } finally {
        await pool.end();
    }
}

// Ejecutar el diagnóstico
diagnosticarTrazabilidad();