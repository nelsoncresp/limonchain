// controllers/admin.controller.js
import Joi from 'joi';
import { createUser, getUserByEmail, getAllUsers, updateUser, deleteUser } from '../models/user.model.js';
import { hashPassword } from '../services/password.service.js';
import { pool } from "../config/db.js";

const createUserSchema = Joi.object({
    nombre: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    telefono: Joi.string().allow('').optional(),
    rol: Joi.string().valid('AGRICULTOR', 'COMPRADOR', 'ANALISTA', 'ADMIN', 'TRANSPORTISTA').required()
});

const updateUserSchema = Joi.object({
    nombre: Joi.string().min(3).optional(),
    telefono: Joi.string().allow('').optional(),
    rol: Joi.string().valid('AGRICULTOR', 'COMPRADOR', 'ANALISTA', 'ADMIN', 'TRANSPORTISTA').optional(),
    estado: Joi.boolean().optional()
});

export const AdminController = {
    // Crear cualquier tipo de usuario
    crearUsuario: async (req, res) => {
        try {
            if (req.user.rol !== 'ADMIN') {
                return res.status(403).json({ error: 'Solo administradores pueden crear usuarios' });
            }

            const { error, value } = createUserSchema.validate(req.body);
            if (error) return res.status(400).json({ message: error.details[0].message });

            const userExists = await getUserByEmail(value.email);
            if (userExists) {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }

            const password_hash = await hashPassword(value.password);
            const user = await createUser({
                nombre: value.nombre,
                email: value.email,
                password_hash,
                telefono: value.telefono || null,
                rol: value.rol
            });

            res.status(201).json({
                message: 'Usuario creado exitosamente',
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol,
                    telefono: user.telefono,
                    fecha_creacion: user.fecha_creacion
                }
            });

        } catch (err) {
            console.error('Error en crearUsuario:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Listar todos los usuarios
    listarUsuarios: async (req, res) => {
        try {
            if (req.user.rol !== 'ADMIN') {
                return res.status(403).json({ error: 'Solo administradores pueden listar usuarios' });
            }

            const users = await getAllUsers();
            res.json({ users });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al listar usuarios' });
        }
    },

    // Obtener usuario específico
    obtenerUsuario: async (req, res) => {
        try {
            if (req.user.rol !== 'ADMIN') {
                return res.status(403).json({ error: 'Solo administradores pueden ver usuarios' });
            }

            const { id } = req.params;
            const user = await getUserById(id);

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json({ user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener usuario' });
        }
    },

    // Actualizar usuario
    actualizarUsuario: async (req, res) => {
        try {
            if (req.user.rol !== 'ADMIN') {
                return res.status(403).json({ error: 'Solo administradores pueden actualizar usuarios' });
            }

            const { id } = req.params;

            // No permitir auto-eliminación o auto-desactivación
            if (parseInt(id) === req.user.id) {
                return res.status(400).json({ error: 'No puedes modificar tu propio usuario' });
            }

            const { error, value } = updateUserSchema.validate(req.body);
            if (error) return res.status(400).json({ message: error.details[0].message });

            const updatedUser = await updateUser(id, value);

            if (!updatedUser) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json({
                message: 'Usuario actualizado exitosamente',
                user: updatedUser
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al actualizar usuario' });
        }
    },

    // Eliminar usuario
    eliminarUsuario: async (req, res) => {
        try {
            if (req.user.rol !== 'ADMIN') {
                return res.status(403).json({ error: 'Solo administradores pueden eliminar usuarios' });
            }

            const { id } = req.params;

            if (parseInt(id) === req.user.id) {
                return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
            }

            const success = await deleteUser(id);

            if (!success) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json({ message: 'Usuario eliminado exitosamente' });
        } catch (err) {
            console.error(err);

            // Manejar error de clave foránea
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({
                    error: 'No se puede eliminar el usuario porque tiene registros asociados. Desactívalo en su lugar.'
                });
            }

            res.status(500).json({ error: 'Error al eliminar usuario' });
        }
    },

    // Agregar este método al AdminController
    estadisticasSistema: async (req, res) => {
        try {
            if (req.user.rol !== 'ADMIN') {
                return res.status(403).json({ error: 'Solo administradores pueden ver estadísticas' });
            }

            const [
                usuariosStats,
                lotesStats,
                contratosStats,
                blockchainStats
            ] = await Promise.all([
                // Estadísticas de usuarios
                pool.query(`
                SELECT 
                    COUNT(*) as total,
                    SUM(estado = 1) as activos,
                    SUM(rol = 'AGRICULTOR') as agricultores,
                    SUM(rol = 'COMPRADOR') as compradores,
                    SUM(rol = 'ANALISTA') as analistas,
                    SUM(rol = 'TRANSPORTISTA') as transportistas,
                    SUM(rol = 'ADMIN') as admins
                FROM users
            `),

                // Estadísticas de lotes
                pool.query(`
                SELECT 
                    COUNT(*) as total,
                    SUM(estado = 'DISPONIBLE') as disponibles,
                    SUM(estado = 'RESERVADO') as reservados,
                    SUM(estado = 'EN_TRANSPORTE') as en_transporte,
                    SUM(estado = 'ENTREGADO') as entregados
                FROM lotes
            `),

                // Estadísticas de contratos
                pool.query(`
                SELECT 
                    COUNT(*) as total,
                    SUM(estado = 'PENDIENTE_ANALISIS') as pendientes,
                    SUM(estado = 'APROBADO_ANALISTA') as aprobados,
                    SUM(estado = 'EN_BLOCKCHAIN') as en_blockchain,
                    SUM(estado = 'COMPLETADO') as completados
                FROM contratos
            `),

                // Estadísticas de blockchain
                pool.query(`
                SELECT 
                    COUNT(*) as total_bloques,
                    (SELECT COUNT(*) FROM blockchain_nodos WHERE estado = 'ACTIVO') as nodos_activos
                FROM blockchain_blocks
            `)
            ]);

            res.json({
                usuarios: usuariosStats[0][0],
                lotes: lotesStats[0][0],
                contratos: contratosStats[0][0],
                blockchain: blockchainStats[0][0],
                fecha_actual: new Date().toISOString()
            });

        } catch (err) {
            console.error('Error en estadisticasSistema:', err);
            res.status(500).json({ error: 'Error al obtener estadísticas del sistema' });
        }
    },
    // controllers/admin.controller.js - Método completamente corregido
estadisticasUsuarios: async (req, res) => {
    try {
        if (req.user.rol !== 'ADMIN') {
            return res.status(403).json({ error: 'Solo administradores pueden ver estadísticas' });
        }

        const [stats] = await pool.query(`
            SELECT 
                rol,
                COUNT(*) as total,
                SUM(estado = 1) as activos,
                SUM(estado = 0) as inactivos
            FROM users 
            GROUP BY rol
            ORDER BY total DESC
        `);

        const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM users');
        const total_usuarios = parseInt(totalResult[0].total);
        
        // Convertir todos los valores a números enteros
        const statsCorregidos = stats.map(item => ({
            ...item,
            total: parseInt(item.total),
            activos: parseInt(item.activos || 0),
            inactivos: parseInt(item.inactivos || 0)
        }));

        // Calcular totales correctamente
        const totalActivos = statsCorregidos.reduce((sum, item) => sum + item.activos, 0);
        const totalInactivos = statsCorregidos.reduce((sum, item) => sum + item.inactivos, 0);
        
        // Verificar que los totales coincidan
        const totalVerificado = statsCorregidos.reduce((sum, item) => sum + item.total, 0);
        
        res.json({
            total_usuarios: total_usuarios,
            total_verificado: totalVerificado,
            por_rol: statsCorregidos,
            resumen: {
                total_activos: totalActivos,
                total_inactivos: totalInactivos,
                porcentaje_activos: total_usuarios > 0 ? ((totalActivos / total_usuarios) * 100).toFixed(1) + '%' : '0%'
            }
        });

    } catch (err) {
        console.error('Error detallado en estadisticasUsuarios:', err);
        console.error('Stack trace:', err.stack);
        res.status(500).json({ 
            error: 'Error al obtener estadísticas',
            detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
},
};
