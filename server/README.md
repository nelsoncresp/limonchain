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
