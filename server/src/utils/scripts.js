
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

async function createFirstAdmin() {
    try {
        console.log('🔧 Intentando crear administrador...');
        
        const adminData = {
            nombre: 'Administrador Principal',
            email: 'admin@limochain.com',
            password: 'Admin123!',
            telefono: '3000000000',
            rol: 'ADMIN'
        };

        // Verificar si ya existe
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [adminData.email]);
        if (existing.length > 0) {
            console.log('✅ El administrador principal ya existe');
            return;
        }

        // Crear admin
        const password_hash = await bcrypt.hash(adminData.password, 10);
        
        const [result] = await pool.query(
            `INSERT INTO users (nombre, email, password_hash, telefono, rol, estado)
             VALUES (?, ?, ?, ?, ?, 1)`,
            [adminData.nombre, adminData.email, password_hash, adminData.telefono, adminData.rol]
        );

        console.log('🎉 ADMINISTRADOR CREADO EXITOSAMENTE!');
        console.log('📧 Email:', adminData.email);
        console.log('🔑 Password:', adminData.password);
        console.log('🆔 ID:', result.insertId);
        
    } catch (error) {
        console.error('❌ Error creando administrador:', error.message);
        console.log('💡 Sugerencia: Verifica que MySQL esté ejecutándose y las credenciales en .env');
    } finally {
        await pool.end();
    }
}

createFirstAdmin();