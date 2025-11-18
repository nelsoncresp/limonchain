# Versión IT
# LimoChain - Backend (Node.js + Express + MySQL)

Estructura: ES Modules (`"type": "module"`), usa `mysql2/promise` (sin ORM).

## Requisitos
- Node 18+
- XAMPP con MySQL (o MySQL local)
- phpMyAdmin (opcional) para importar la DB SQL

## Instalación
1. Clona el repo.
2. `npm install`
3. Copia `.env.example` a `.env` y configura las variables.
4. Importa el script SQL en `phpMyAdmin`
5. `npm run dev` (requiere nodemon) o `npm start`.

## Estructura básica
src/
config/
controllers/
middlewares/
routes/
services/
models/
utils/
app.js

## Notas
- No se usa Sequelize; la conexión se hace con `mysql2/promise`.
- Usamos JWT para auth, bcrypt para contraseñas.
- El flujo de contratos incluye revisión by ANALISTA y deploy a blockchain mediante un servicio específico.

# 🟢 LimonChain – Documentación Completa del Sistema

LimonChain es una plataforma de trazabilidad agrícola con control completo de **usuarios, lotes, contratos, blockchain, transporte y estadísticas**.  
Esta documentación describe todos los **roles, módulos y rutas**, incluyendo la lógica de negocio y permisos de cada componente.

---

## 🔹 Roles del Sistema

| Rol          | Permisos principales                                                                 |
| ------------ | ---------------------------------------------------------------------------------- |
| **ADMIN**    | CRUD usuarios, supervisión global, blockchain, transporte, notificaciones, estadísticas |
| **Analista** | Evaluación de contratos, supervisión de lotes, validación de calidad                |
| **Agricultor** | Registro de lotes, seguimiento de producción                                      |
| **Comprador**  | Solicitud de contratos, revisión de lotes                                          |
| **Transportista** | Gestión de rutas y entregas, reporte de transporte                               |

> Cada rol tiene un conjunto de rutas y permisos específicos, garantizando seguridad y trazabilidad.

---

## 1️ ADMIN – Superusuario

El ADMIN tiene **máximo nivel de permisos**, incluyendo:

- CRUD completo sobre usuarios.  
- Supervisión de estadísticas globales.  
- Auditoría de lotes y contratos.  
- Control total de blockchain y transporte.  
- Gestión de notificaciones internas.

**Restricciones:**

- No puede modificar ni eliminar su propio usuario.
- No puede crear contratos ni modificar lotes (solo supervisión).

### Principales rutas

#### Usuarios

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| POST | /api/admin/users | Crear usuario |
| GET  | /api/admin/users | Listar usuarios |
| GET  | /api/admin/users/:id | Detalle de usuario |
| PUT  | /api/admin/users/:id | Actualizar usuario |
| DELETE | /api/admin/users/:id | Eliminar usuario (excepto sí mismo) |

#### Estadísticas

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | /api/admin/stats-system | Estadísticas completas del sistema |
| GET | /api/admin/stats-users | Estadísticas de usuarios por rol |

#### Lotes

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | /api/lotes | Ver todos los lotes |

#### Contratos

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | /api/contratos | Ver todos los contratos |
| GET | /api/contratos/:id | Detalle de contrato |

#### Blockchain

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | /api/blockchain | Ver todos los bloques y nodos |
| GET | /api/blockchain/verify/:hash | Verificar integridad de bloque |
| POST | /api/blockchain/register | Registrar evento de auditoría |

#### Transporte

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | /api/transporte | Ver rutas y entregas |
| POST | /api/transporte | Crear ruta/entrega |
| PUT | /api/transporte/:id | Actualizar estado de transporte |

#### Notificaciones

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | /api/notificaciones | Ver todas las notificaciones |
| POST | /api/notificaciones | Crear notificación interna |

#### Sistema

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | /health | Estado del servidor |
| GET | /api/docs | Documentación API |
| GET | /api/docs/json | Documentación JSON |

---

## 2 Analista

El **Analista** supervisa y evalúa la calidad de los lotes y contratos.

### Rutas principales

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | /api/contratos/pending | Contratos pendientes de evaluación |
| PUT | /api/contratos/:id/approve | Aprobar contrato |
| PUT | /api/contratos/:id/reject | Rechazar contrato |
| GET | /api/lotes | Ver lotes para auditoría |
| PUT | /api/lotes/:id/validate | Validar calidad del lote |

---

## 3️ Agricultor

El **Agricultor** crea y gestiona sus propios lotes.

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| POST | /api/lotes | Crear lote |
| GET | /api/lotes/my | Ver mis lotes |
| PUT | /api/lotes/:id | Actualizar lote |
| DELETE | /api/lotes/:id | Eliminar lote |

---

## 4️ Comprador

El **Comprador** solicita contratos y puede revisar lotes.

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| POST | /api/contratos | Crear contrato |
| GET  | /api/contratos/my | Ver mis contratos |
| GET  | /api/lotes | Ver lotes disponibles |

---

## 5️ Transportista

El **Transportista** gestiona rutas y entrega de lotes.

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | /api/transporte/my | Ver mis rutas |
| POST | /api/transporte/report | Reportar entrega |
| PUT | /api/transporte/:id/status | Actualizar estado de transporte |

---

## 6️ Blockchain

- Registro de eventos, nodos y bloques.
- Auditoría de integridad.
- Supervisión global (solo ADMIN).

---

## 7️ Notificaciones

- Todos los roles pueden recibir notificaciones.  
- ADMIN puede crear y monitorear todas.

---

## 8️ Estadísticas

- Estadísticas por rol y sistema.  
- Gráficos listos para frontend: pie, donut, barras.


## Resumen de permisos por módulo

| Módulo       | ADMIN | Analista | Agricultor | Comprador | Transportista |
| ------------ | ----- | -------- | ---------- | --------- | ------------- |
| Usuarios     | ✔     | ❌       | ❌         | ❌        | ❌            |
| Lotes        | ✔     | ✔        | ✔          | ✔         | ❌            |
| Contratos    | ✔     | ✔        | ❌         | ✔         | ❌            |
| Blockchain   | ✔     | ❌       | ❌         | ❌        | ❌            |
| Transporte   | ✔     | ❌       | ❌         | ❌        | ✔             |
| Notificaciones | ✔   | ❌       | ✔          | ✔         | ✔             |
| Estadísticas | ✔     | ✔        | ❌         | ❌        | ❌            |


**LimonChain** es un sistema seguro, trazable y modular, listo para integrarse con frontend moderno, dashboards y auditoría completa.  

