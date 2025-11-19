-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-11-2025 a las 23:42:19
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `limonchain`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agricultores_info`
--

CREATE TABLE `agricultores_info` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `tamano_finca` varchar(100) DEFAULT NULL,
  `certificaciones` text DEFAULT NULL,
  `experiencia` int(11) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id` int(11) NOT NULL,
  `actor_user_id` int(11) DEFAULT NULL,
  `accion` varchar(100) NOT NULL,
  `detalle` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`detalle`)),
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blockchain_blocks`
--

CREATE TABLE `blockchain_blocks` (
  `id` int(11) NOT NULL,
  `contrato_id` int(11) NOT NULL,
  `lote_id` int(11) NOT NULL,
  `agricultor_id` int(11) NOT NULL,
  `comprador_id` int(11) NOT NULL,
  `analista_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(12,2) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `hash` varchar(64) NOT NULL,
  `previous_hash` varchar(64) DEFAULT '0',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `blockchain_blocks`
--

INSERT INTO `blockchain_blocks` (`id`, `contrato_id`, `lote_id`, `agricultor_id`, `comprador_id`, `analista_id`, `cantidad`, `precio_unitario`, `estado`, `hash`, `previous_hash`, `fecha_creacion`) VALUES
(1, 4, 6, 1, 2, 4, 10, 2500.00, 'APROBADO_ANALISTA', '6f042c9121c14ab822f9af264993cd6e05fa171119cc5312342780a9fe1e2251', '0', '2025-11-14 21:28:55'),
(2, 4, 6, 1, 2, 4, 10, 2500.00, 'APROBADO_ANALISTA', '82797cb0f94c3a8464aa794b62807bad9af0862332c6e08ed9dcfc533f67fd48', '6f042c9121c14ab822f9af264993cd6e05fa171119cc5312342780a9fe1e2251', '2025-11-14 22:01:36'),
(3, 4, 6, 1, 2, 4, 10, 2500.00, 'APROBADO_ANALISTA', '5729c9b7c08436d7484c9e7e3c5516e83b5d9917ba48dcac347b28418236f4f4', '82797cb0f94c3a8464aa794b62807bad9af0862332c6e08ed9dcfc533f67fd48', '2025-11-14 22:04:43'),
(4, 4, 6, 1, 2, 4, 10, 2500.00, 'APROBADO_ANALISTA', '0276faef4c336e5832acef53b0133a8904cd43ab7e37b5f79880e4090c2584ed', '5729c9b7c08436d7484c9e7e3c5516e83b5d9917ba48dcac347b28418236f4f4', '2025-11-14 22:25:15'),
(5, 8, 4, 1, 2, 12, 12, 2600.00, 'APROBADO_ANALISTA', '9de3b16806b50c8b4dc3adbdfa863c3e823291ca50132fd82f61ca6ca17b7a32', '0276faef4c336e5832acef53b0133a8904cd43ab7e37b5f79880e4090c2584ed', '2025-11-17 22:19:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blockchain_confirmaciones`
--

CREATE TABLE `blockchain_confirmaciones` (
  `id` int(11) NOT NULL,
  `bloque_id` int(11) NOT NULL,
  `nodo_id` int(11) NOT NULL,
  `confirmado` tinyint(1) DEFAULT 0,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `blockchain_confirmaciones`
--

INSERT INTO `blockchain_confirmaciones` (`id`, `bloque_id`, `nodo_id`, `confirmado`, `fecha`) VALUES
(1, 1, 1, 1, '2025-11-14 22:24:38'),
(2, 1, 2, 1, '2025-11-14 22:24:38'),
(3, 1, 3, 1, '2025-11-14 22:24:38'),
(4, 1, 4, 1, '2025-11-14 22:24:38'),
(5, 1, 5, 1, '2025-11-14 22:24:38'),
(8, 2, 1, 1, '2025-11-14 22:24:38'),
(9, 2, 2, 1, '2025-11-14 22:24:38'),
(10, 2, 3, 1, '2025-11-14 22:24:38'),
(11, 2, 4, 1, '2025-11-14 22:24:38'),
(12, 2, 5, 1, '2025-11-14 22:24:38'),
(15, 3, 1, 1, '2025-11-14 22:24:38'),
(16, 3, 2, 1, '2025-11-14 22:24:38'),
(17, 3, 3, 1, '2025-11-14 22:24:38'),
(18, 3, 4, 1, '2025-11-14 22:24:38'),
(19, 3, 5, 1, '2025-11-14 22:24:38'),
(22, 4, 1, 1, '2025-11-14 22:25:15'),
(23, 4, 2, 1, '2025-11-14 22:25:15'),
(24, 4, 3, 1, '2025-11-14 22:25:15'),
(25, 4, 4, 1, '2025-11-14 22:25:15'),
(26, 4, 5, 1, '2025-11-14 22:25:15'),
(27, 5, 1, 1, '2025-11-17 22:19:41'),
(28, 5, 2, 1, '2025-11-17 22:19:41'),
(29, 5, 3, 1, '2025-11-17 22:19:41'),
(30, 5, 4, 1, '2025-11-17 22:19:41'),
(31, 5, 5, 1, '2025-11-17 22:19:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blockchain_nodos`
--

CREATE TABLE `blockchain_nodos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `blockchain_nodos`
--

INSERT INTO `blockchain_nodos` (`id`, `nombre`, `estado`) VALUES
(1, 'Nodo_Principal_1', 'ACTIVO'),
(2, 'Nodo_Backup_2', 'ACTIVO'),
(3, 'Nodo_Validacion_3', 'ACTIVO'),
(4, 'Nodo_Auditoria_4', 'ACTIVO'),
(5, 'Nodo_Respaldo_5', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compradores_info`
--

CREATE TABLE `compradores_info` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `empresa` varchar(255) DEFAULT NULL,
  `nit` varchar(50) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contratos`
--

CREATE TABLE `contratos` (
  `id` int(11) NOT NULL,
  `lote_id` int(11) NOT NULL,
  `agricultor_id` int(11) NOT NULL,
  `comprador_id` int(11) NOT NULL,
  `analista_id` int(11) DEFAULT NULL,
  `precio_unitario` decimal(12,2) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `destino` varchar(255) NOT NULL,
  `estado` enum('PENDIENTE_ANALISIS','RECHAZADO_ANALISTA','APROBADO_ANALISTA','EN_BLOCKCHAIN','ACEPTADO_COMPRADOR','EN_TRANSPORTE','ENTREGADO','COMPLETADO') NOT NULL DEFAULT 'PENDIENTE_ANALISIS',
  `comentario_analista` text DEFAULT NULL,
  `contrato_hash_blockchain` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `costo_estimado` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `contratos`
--

INSERT INTO `contratos` (`id`, `lote_id`, `agricultor_id`, `comprador_id`, `analista_id`, `precio_unitario`, `cantidad`, `fecha_entrega`, `destino`, `estado`, `comentario_analista`, `contrato_hash_blockchain`, `fecha_creacion`, `fecha_actualizacion`, `costo_estimado`) VALUES
(1, 1, 1, 2, NULL, 2500.00, 10, '2025-12-01', '', 'APROBADO_ANALISTA', NULL, NULL, '2025-11-14 19:30:49', '2025-11-17 23:01:17', 1800.00),
(2, 3, 1, 2, NULL, 2500.00, 10, '2025-12-01', '', 'EN_BLOCKCHAIN', NULL, NULL, '2025-11-14 20:40:37', '2025-11-17 23:01:17', 1750.00),
(3, 5, 1, 5, NULL, 2500.00, 10, '2025-12-01', '', 'EN_BLOCKCHAIN', NULL, NULL, '2025-11-14 21:05:09', '2025-11-17 23:01:17', 1600.00),
(4, 6, 1, 2, NULL, 2500.00, 10, '2025-12-01', '', 'ENTREGADO', NULL, NULL, '2025-11-14 21:24:45', '2025-11-15 00:16:50', NULL),
(8, 4, 1, 2, NULL, 2600.00, 12, '2025-12-20', '', 'EN_BLOCKCHAIN', NULL, NULL, '2025-11-17 22:18:13', '2025-11-17 22:19:41', NULL),
(9, 5, 1, 5, 3, 3000.00, 20, '2025-12-25', '', 'PENDIENTE_ANALISIS', NULL, NULL, '2025-11-17 22:18:13', '2025-11-17 23:44:23', 1000.00),
(10, 7, 13, 2, NULL, 3200.00, 100, '2025-12-20', '', 'PENDIENTE_ANALISIS', NULL, NULL, '2025-11-18 17:21:51', '2025-11-18 17:21:51', NULL),
(11, 7, 13, 5, NULL, 3500.00, 50, '2025-12-25', '', 'APROBADO_ANALISTA', NULL, NULL, '2025-11-16 17:21:51', '2025-11-18 17:21:51', NULL),
(12, 7, 13, 2, NULL, 3800.00, 75, '2025-12-30', '', 'EN_BLOCKCHAIN', NULL, NULL, '2025-11-13 17:21:51', '2025-11-18 17:21:51', NULL),
(13, 4, 1, 5, NULL, 8000.00, 5, NULL, '', 'PENDIENTE_ANALISIS', NULL, NULL, '2025-11-18 19:21:31', '2025-11-18 19:21:31', NULL),
(14, 7, 13, 5, NULL, 8000.00, 250, NULL, '', 'PENDIENTE_ANALISIS', NULL, NULL, '2025-11-18 19:29:39', '2025-11-18 19:29:39', NULL);

--
-- Disparadores `contratos`
--
DELIMITER $$
CREATE TRIGGER `trg_update_contrato` BEFORE UPDATE ON `contratos` FOR EACH ROW BEGIN
    SET NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotes`
--

CREATE TABLE `lotes` (
  `id` int(11) NOT NULL,
  `agricultor_id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `unidad` enum('KG','TON','UNIDADES') DEFAULT 'KG',
  `calidad` varchar(50) DEFAULT NULL,
  `fecha_cosecha` date DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `foto_url` text DEFAULT NULL,
  `estado` enum('DISPONIBLE','RESERVADO','EN_TRANSPORTE','ENTREGADO') DEFAULT 'DISPONIBLE',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lotes`
--

INSERT INTO `lotes` (`id`, `agricultor_id`, `nombre`, `cantidad`, `unidad`, `calidad`, `fecha_cosecha`, `descripcion`, `foto_url`, `estado`, `fecha_creacion`) VALUES
(1, 1, 'Lote Prueba', 10, 'KG', 'A', '2025-01-01', 'Prueba módulo', 'https://ejemplo.com', 'RESERVADO', '2025-11-14 19:12:19'),
(3, 1, 'Lote Prueba 2', 10, 'KG', 'A', '2025-01-01', 'Prueba módulo', 'https://ejemplo.com', 'RESERVADO', '2025-11-14 19:13:39'),
(4, 1, 'Lote Prueba', 10, 'KG', 'A', '2025-01-01', 'Prueba módulo', 'https://ejemplo.com', 'RESERVADO', '2025-11-14 20:38:50'),
(5, 1, 'Lote Prueba 3', 10, 'KG', 'A', '2025-01-01', 'Prueba flujo completo', 'https://ejemplo.com/lote3.jpg', 'RESERVADO', '2025-11-14 21:04:10'),
(6, 1, 'Lote Prueba 3', 10, 'KG', 'A', '2025-01-01', 'Prueba flujo completo', 'https://ejemplo.com/lote3.jpg', 'ENTREGADO', '2025-11-14 21:23:12'),
(7, 13, 'limon Finca Hercules', 500, 'KG', 'A', '2025-11-10', 'Tahití', '', 'RESERVADO', '2025-11-18 01:20:02'),
(8, 13, 'Finca limonera', 5000, 'KG', 'Premiun', '2023-03-12', '', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTunzn4KRwGu5HJYX6C5yKyTHnUrv9goBojbA&s', 'DISPONIBLE', '2025-11-18 15:38:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metricas_sistema`
--

CREATE TABLE `metricas_sistema` (
  `id` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_agricultores` int(11) DEFAULT 0,
  `total_compradores` int(11) DEFAULT 0,
  `total_contratos` int(11) DEFAULT 0,
  `contratos_completados` int(11) DEFAULT 0,
  `total_lotes` int(11) DEFAULT 0,
  `lotes_en_transporte` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `tipo` enum('CONTRATO_NUEVO','CONTRATO_APROBADO','TRANSPORTE_ASIGNADO','ENTREGA_COMPLETADA','CALIFICACION_RECIBIDA') DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `mensaje` text NOT NULL,
  `leida` tinyint(1) DEFAULT 0,
  `relacion_id` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `usuario_id`, `tipo`, `titulo`, `mensaje`, `leida`, `relacion_id`, `fecha_creacion`) VALUES
(1, 2, 'CONTRATO_APROBADO', 'Contrato aprobado ✅', 'Tu contrato con Pedro Morales ha sido aprobado. El lote está en camino.', 0, 8, '2025-11-17 22:19:41'),
(2, 1, 'CONTRATO_NUEVO', '¡Nuevo contrato recibido! 🎉', 'El comprador Nelson quiere adquirir tu lote. Revisa los detalles del contrato.', 0, 13, '2025-11-18 19:21:31'),
(3, 13, 'CONTRATO_NUEVO', '¡Nuevo contrato recibido! 🎉', 'El comprador Nelson quiere adquirir tu lote. Revisa los detalles del contrato.', 0, 14, '2025-11-18 19:29:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transporte`
--

CREATE TABLE `transporte` (
  `id` int(11) NOT NULL,
  `contrato_id` int(11) NOT NULL,
  `transportista_id` int(11) NOT NULL,
  `ruta` text DEFAULT NULL,
  `fecha_asignacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('ASIGNADO','EN_RUTA','ENTREGADO','FALLIDO') DEFAULT 'ASIGNADO',
  `evidencia_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `transporte`
--

INSERT INTO `transporte` (`id`, `contrato_id`, `transportista_id`, `ruta`, `fecha_asignacion`, `estado`, `evidencia_url`) VALUES
(1, 4, 8, 'De finca Pedro Morales a bodega Carlos Buyer - Ruta Nacional 45', '2025-11-15 00:08:24', 'ENTREGADO', 'https://ejemplo.com/foto-entrega-completada.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transportistas_info`
--

CREATE TABLE `transportistas_info` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `placa_vehiculo` varchar(20) DEFAULT NULL,
  `tipo_vehiculo` varchar(50) DEFAULT NULL,
  `capacidad_kg` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trazabilidad`
--

CREATE TABLE `trazabilidad` (
  `id` int(11) NOT NULL,
  `contrato_id` int(11) DEFAULT NULL,
  `lote_id` int(11) DEFAULT NULL,
  `evento` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `hash_blockchain` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `trazabilidad`
--

INSERT INTO `trazabilidad` (`id`, `contrato_id`, `lote_id`, `evento`, `descripcion`, `hash_blockchain`, `fecha`) VALUES
(1, NULL, 1, 'LOTE CREADO', 'Lote \"Lote Prueba\" creado con 10 KG. Calidad: A. Cosecha: 2025-01-01', NULL, '2025-11-14 19:12:19'),
(2, NULL, 3, 'LOTE CREADO', 'Lote \"Lote Prueba 2\" creado con 10 KG. Calidad: A. Cosecha: 2025-01-01', NULL, '2025-11-14 19:13:39'),
(3, NULL, 4, 'LOTE CREADO', 'Lote \"Lote Prueba\" creado con 10 KG. Calidad: A. Cosecha: 2025-01-01', NULL, '2025-11-14 20:38:50'),
(4, NULL, 5, 'LOTE CREADO', 'Lote \"Lote Prueba 3\" creado con 10 KG. Calidad: A. Cosecha: 2025-01-01', NULL, '2025-11-14 21:04:10'),
(5, NULL, 6, 'LOTE CREADO', 'Lote \"Lote Prueba 3\" creado con 10 KG. Calidad: A. Cosecha: 2025-01-01', NULL, '2025-11-14 21:23:12'),
(8, 1, 1, 'CONTRATO CREADO', 'Contrato #1 creado para lote \"Lote Prueba\". Comprador: Carlos Buyer. Cantidad: 10 a $2500.00 c/u. Entrega: 2025-12-01', NULL, '2025-11-14 19:30:49'),
(9, 2, 3, 'CONTRATO CREADO', 'Contrato #2 creado para lote \"Lote Prueba 2\". Comprador: Carlos Buyer. Cantidad: 10 a $2500.00 c/u. Entrega: 2025-12-01', NULL, '2025-11-14 20:40:37'),
(10, 3, 5, 'CONTRATO CREADO', 'Contrato #3 creado para lote \"Lote Prueba 3\". Comprador: Nelson. Cantidad: 10 a $2500.00 c/u. Entrega: 2025-12-01', NULL, '2025-11-14 21:05:09'),
(11, 4, 6, 'CONTRATO CREADO', 'Contrato #4 creado para lote \"Lote Prueba 3\". Comprador: Carlos Buyer. Cantidad: 10 a $2500.00 c/u. Entrega: 2025-12-01', NULL, '2025-11-14 21:24:45'),
(12, 8, 4, 'CONTRATO CREADO', 'Contrato #8 creado para lote \"Lote Prueba\". Comprador: Carlos Buyer. Cantidad: 12 a $2600.00 c/u. Entrega: 2025-12-20', NULL, '2025-11-17 22:18:13'),
(13, 9, 5, 'CONTRATO CREADO', 'Contrato #9 creado para lote \"Lote Prueba 3\". Comprador: Nelson. Cantidad: 20 a $3000.00 c/u. Entrega: 2025-12-25', NULL, '2025-11-17 22:18:13'),
(15, 1, 1, 'CONTRATO APROBADO', 'Contrato aprobado por analista. Estado: APROBADO_ANALISTA', NULL, '2025-11-18 16:25:23'),
(16, 2, 3, 'CONTRATO APROBADO', 'Contrato aprobado por analista. Estado: EN_BLOCKCHAIN', NULL, '2025-11-18 16:25:23'),
(17, 3, 5, 'CONTRATO APROBADO', 'Contrato aprobado por analista. Estado: EN_BLOCKCHAIN', NULL, '2025-11-18 16:25:23'),
(18, 4, 6, 'CONTRATO APROBADO', 'Contrato aprobado por analista. Estado: ENTREGADO', NULL, '2025-11-18 16:25:23'),
(19, 8, 4, 'CONTRATO APROBADO', 'Contrato aprobado por analista. Estado: EN_BLOCKCHAIN. Analista ID: 12', NULL, '2025-11-18 16:25:23'),
(22, 4, 6, 'REGISTRADO EN BLOCKCHAIN', 'Contrato registrado en blockchain. Hash confirmado por 5 nodos', '0276faef4c336e5832acef53b0133a8904cd43ab7e37b5f79880e4090c2584ed', '2025-11-18 16:25:23'),
(23, 8, 4, 'REGISTRADO EN BLOCKCHAIN', 'Contrato registrado en blockchain. Hash confirmado por 5 nodos', '9de3b16806b50c8b4dc3adbdfa863c3e823291ca50132fd82f61ca6ca17b7a32', '2025-11-18 16:25:23'),
(25, 4, 6, 'TRANSPORTE ENTREGADO', 'Estado transporte: ENTREGADO. Ruta: De finca Pedro Morales a bodega Carlos Buyer - Ruta Nacional 45. Evidencia: https://ejemplo.com/foto-entrega-completada.jpg', NULL, '2025-11-15 00:08:24'),
(26, 4, 6, 'ENTREGA COMPLETADA', 'Producto entregado exitosamente al comprador. Transacción completada', NULL, '2025-11-18 16:25:24'),
(27, 4, 6, 'PAGO PROCESADO', 'Pago transferido al agricultor. Transacción financiera completada', NULL, '2025-11-18 16:25:24'),
(31, NULL, 1, 'LOTE CREADO', 'Lote \"Lote Prueba\" creado con 10 KG. Calidad: A. Cosecha: 2025-01-01', NULL, '2025-11-14 19:12:19'),
(32, NULL, 3, 'LOTE CREADO', 'Lote \"Lote Prueba 2\" creado con 10 KG. Calidad: A. Cosecha: 2025-01-01', NULL, '2025-11-14 19:13:39'),
(33, NULL, 4, 'LOTE CREADO', 'Lote \"Lote Prueba\" creado con 10 KG. Calidad: A. Cosecha: 2025-01-01', NULL, '2025-11-14 20:38:50'),
(34, NULL, 5, 'LOTE CREADO', 'Lote \"Lote Prueba 3\" creado con 10 KG. Calidad: A. Cosecha: 2025-01-01', NULL, '2025-11-14 21:04:10'),
(35, NULL, 6, 'LOTE CREADO', 'Lote \"Lote Prueba 3\" creado con 10 KG. Calidad: A. Cosecha: 2025-01-01', NULL, '2025-11-14 21:23:12'),
(36, NULL, 7, 'LOTE CREADO', 'Lote \"limon Finca Hercules\" creado con 500 KG. Calidad: A. Cosecha: 0000-00-00', NULL, '2025-11-10 13:00:00'),
(38, 1, 1, 'CONTRATO CREADO', 'Contrato #1 creado para lote \"Lote Prueba\". Comprador: Carlos Buyer. Cantidad: 10 a $2500.00 c/u. Entrega: 2025-12-01', NULL, '2025-11-14 19:30:49'),
(39, 2, 3, 'CONTRATO CREADO', 'Contrato #2 creado para lote \"Lote Prueba 2\". Comprador: Carlos Buyer. Cantidad: 10 a $2500.00 c/u. Entrega: 2025-12-01', NULL, '2025-11-14 20:40:37'),
(40, 3, 5, 'CONTRATO CREADO', 'Contrato #3 creado para lote \"Lote Prueba 3\". Comprador: Nelson. Cantidad: 10 a $2500.00 c/u. Entrega: 2025-12-01', NULL, '2025-11-14 21:05:09'),
(41, 4, 6, 'CONTRATO CREADO', 'Contrato #4 creado para lote \"Lote Prueba 3\". Comprador: Carlos Buyer. Cantidad: 10 a $2500.00 c/u. Entrega: 2025-12-01', NULL, '2025-11-14 21:24:45'),
(42, 8, 4, 'CONTRATO CREADO', 'Contrato #8 creado para lote \"Lote Prueba\". Comprador: Carlos Buyer. Cantidad: 12 a $2600.00 c/u. Entrega: 2025-12-20', NULL, '2025-11-17 22:18:13'),
(43, 9, 5, 'CONTRATO CREADO', 'Contrato #9 creado para lote \"Lote Prueba 3\". Comprador: Nelson. Cantidad: 20 a $3000.00 c/u. Entrega: 2025-12-25', NULL, '2025-11-17 22:18:13'),
(45, 1, 1, 'CONTRATO APROBADO', 'Contrato aprobado por analista. Estado: APROBADO_ANALISTA', NULL, '2025-11-18 16:27:20'),
(46, 2, 3, 'CONTRATO APROBADO', 'Contrato aprobado por analista. Estado: EN_BLOCKCHAIN', NULL, '2025-11-18 16:27:20'),
(47, 3, 5, 'CONTRATO APROBADO', 'Contrato aprobado por analista. Estado: EN_BLOCKCHAIN', NULL, '2025-11-18 16:27:20'),
(48, 4, 6, 'CONTRATO APROBADO', 'Contrato aprobado por analista. Estado: ENTREGADO', NULL, '2025-11-18 16:27:20'),
(49, 8, 4, 'CONTRATO APROBADO', 'Contrato aprobado por analista. Estado: EN_BLOCKCHAIN. Analista ID: 12', NULL, '2025-11-18 16:27:20'),
(52, 4, 6, 'REGISTRADO EN BLOCKCHAIN', 'Contrato registrado en blockchain. Hash confirmado por 5 nodos', '0276faef4c336e5832acef53b0133a8904cd43ab7e37b5f79880e4090c2584ed', '2025-11-18 16:27:20'),
(53, 8, 4, 'REGISTRADO EN BLOCKCHAIN', 'Contrato registrado en blockchain. Hash confirmado por 5 nodos', '9de3b16806b50c8b4dc3adbdfa863c3e823291ca50132fd82f61ca6ca17b7a32', '2025-11-18 16:27:20'),
(55, 4, 6, 'TRANSPORTE ENTREGADO', 'Estado transporte: ENTREGADO. Ruta: De finca Pedro Morales a bodega Carlos Buyer - Ruta Nacional 45. Evidencia: https://ejemplo.com/foto-entrega-completada.jpg', NULL, '2025-11-15 00:08:24'),
(56, 4, 6, 'ENTREGA COMPLETADA', 'Producto entregado exitosamente al comprador. Transacción completada', NULL, '2025-11-18 16:27:20'),
(57, 4, 6, 'PAGO PROCESADO', 'Pago transferido al agricultor. Transacción financiera completada', NULL, '2025-11-18 16:27:20'),
(58, NULL, 7, 'INSPECCIÓN DE CALIDAD', 'Lote de limón Tahití inspeccionado y aprobado para venta', NULL, '2025-11-12 15:30:00'),
(59, NULL, 7, 'CERTIFICACIÓN ORGÁNICA', 'Certificado orgánico obtenido para exportación', NULL, '2025-11-14 19:15:00'),
(60, NULL, 7, 'DISPONIBLE EN MERCADO', 'Lote listo para contratos. Precio competitivo establecido', NULL, '2025-11-17 14:00:00'),
(68, 10, 7, 'CONTRATO CREADO', 'Contrato creado por Carlos Buyer para 100 unidades a $3200 c/u', NULL, '2025-11-18 15:00:00'),
(69, 10, 7, 'LOTE RESERVADO', 'Lote marcado como reservado pendiente de análisis', NULL, '2025-11-18 15:05:00'),
(70, 10, 7, 'EN REVISIÓN', 'Contrato en revisión por analista de calidad', NULL, '2025-11-18 19:30:00'),
(71, 11, 7, 'CONTRATO CREADO', 'Contrato creado por Nelson para 50 unidades a $3500 c/u', NULL, '2025-11-17 14:15:00'),
(72, 11, 7, 'LOTE RESERVADO', 'Lote marcado como reservado', NULL, '2025-11-17 14:20:00'),
(73, 11, 7, 'APROBADO POR ANALISTA', 'Contrato aprobado para proceder con la transacción', NULL, '2025-11-17 21:45:00'),
(74, 11, 7, 'NOTIFICACIÓN ENVIADA', 'Notificación enviada al comprador Nelson', NULL, '2025-11-17 21:50:00'),
(75, 12, 7, 'CONTRATO CREADO', 'Contrato creado por Carlos Buyer para 75 unidades a $3800 c/u', NULL, '2025-11-15 13:30:00'),
(76, 12, 7, 'LOTE RESERVADO', 'Lote marcado como reservado', NULL, '2025-11-15 13:35:00'),
(77, 12, 7, 'APROBADO POR ANALISTA', 'Contrato aprobado por analista', NULL, '2025-11-15 19:20:00'),
(78, 12, 7, 'REGISTRADO EN BLOCKCHAIN', 'Contrato registrado exitosamente en la blockchain', '0x7d8f9a2b4c6e1f3a5b8d0e2f4c6a9b1d3e5f7a8c', '2025-11-16 16:15:00'),
(79, 12, 7, 'CONFIRMACIÓN DE NODOS', 'Transacción confirmada por 5 nodos de la red', '0x7d8f9a2b4c6e1f3a5b8d0e2f4c6a9b1d3e5f7a8c', '2025-11-16 16:20:00'),
(80, NULL, 7, 'INSPECCIÓN INICIAL', 'Lote de limón Tahití inspeccionado y aprobado', NULL, '2025-11-10 14:00:00'),
(81, NULL, 7, 'CERTIFICACIÓN DE CALIDAD', 'Certificado de calidad orgánica obtenido', NULL, '2025-11-12 19:30:00'),
(82, NULL, 7, 'ANÁLISIS DE LABORATORIO', 'Análisis de acidez y dulzura dentro de parámetros óptimos', NULL, '2025-11-14 16:15:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `rol` enum('AGRICULTOR','COMPRADOR','TRANSPORTISTA','ANALISTA','ADMIN') NOT NULL DEFAULT 'AGRICULTOR',
  `wallet_publica` varchar(150) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre`, `email`, `password_hash`, `telefono`, `rol`, `wallet_publica`, `estado`, `fecha_creacion`) VALUES
(1, 'Pedro Morales', 'pedro@correo.com', '$2b$10$sOuEzzs5OW10PN1r7eVQmeyf.JRySbWA5mAE1MCD6MEWvzo07jJ7W', '3001234567', 'AGRICULTOR', NULL, 1, '2025-11-14 18:44:09'),
(2, 'Carlos Buyer', 'carlos@comprador.com', '$2b$10$97MUjPUdZEMpZBNDTiK89.npNYxSvcrvlCJm6yhtsPWConlGWUN7K', '3009876543', 'COMPRADOR', NULL, 1, '2025-11-14 19:18:36'),
(3, 'Ana López', 'analista@correo.com', '$2b$10$CPnVZb0bO5Up4Jrj/Cch0uNjOe1nPBAkX8ZqfjSNZg34VfObfWpZK', '3015556677', 'ANALISTA', NULL, 1, '2025-11-14 19:33:10'),
(5, 'Nelson', 'nels@comprador.com', '$2b$10$rdOxTKAlmIjpmwrjuh4X2uq3cO94EMz6DRPHgLY7Kqsy2PhhSkLnW', '3009876543', 'COMPRADOR', NULL, 1, '2025-11-14 21:00:23'),
(6, 'Administrador Principal', 'admin@limochain.com', '$2b$10$Z4z4k0tMg/5XfebKFWzoveW8s1tVc8UVNB97LvH8h.q.KDL.jV9NK', '3000000000', 'ADMIN', NULL, 1, '2025-11-14 23:07:34'),
(7, 'Carlos Analista', 'carlos.analista@limochain.com', '$2b$10$0buOW1dezgxaYXcBzlj6aeVHwryctxUOMHkr2rMSC4DSfjXEPQlbS', '3001112233', 'ANALISTA', NULL, 1, '2025-11-14 23:10:52'),
(8, 'Maria Transportista', 'maria.transport@limochain.com', '$2b$10$NYeLuZ1KZ37iex6sJMy7iOYpr5.BnrmoIgLaiids7QtDqzC3lre52', '3004445566', 'TRANSPORTISTA', NULL, 1, '2025-11-14 23:11:14'),
(10, 'Nelson crespo padilla', 'nelson123@mail.com', '$2b$10$nh5T7Wt7FTam6Vh9657TD.j63DTXajzYXi5eu1/8vo2/uV5oatQHi', '147852390', 'COMPRADOR', NULL, 1, '2025-11-15 21:35:19'),
(11, 'pepito perez', 'perez@mail.com', '$2b$10$x6G/t6RixtoCHmoc9OJnQeQ.Hx4BAtCvedp40hwrbEhGBou0G9/.2', '3001234567', 'AGRICULTOR', NULL, 1, '2025-11-17 20:42:06'),
(13, 'Juan Perez', 'juan.perez@example.com', '$2b$10$//101VWq53.oyKILG2QSUe0FgjtViHGqkilmUyaRovSvHI5wDdSa2', '1234566789', 'AGRICULTOR', NULL, 1, '2025-11-18 00:58:45'),
(14, 'nelson', 'crespo@mail.com', '$2b$10$NcR8KSw9oqM84ZqLsP9d8ubKfbkIJmb8VVyEs0CayBBPgEMEsdYgK', '123654789', 'AGRICULTOR', NULL, 1, '2025-11-19 22:17:05'),
(15, 'Nelson', 'nelson1234@mail.com', '$2b$10$scvhIxBo781KFs7zyzZcXeYQIu.Bx/sxjKwSt1C5zoF1l.av2YlHu', '1234567890', 'AGRICULTOR', NULL, 1, '2025-11-19 22:18:01');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agricultores_info`
--
ALTER TABLE `agricultores_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `actor_user_id` (`actor_user_id`);

--
-- Indices de la tabla `blockchain_blocks`
--
ALTER TABLE `blockchain_blocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contrato_id` (`contrato_id`);

--
-- Indices de la tabla `blockchain_confirmaciones`
--
ALTER TABLE `blockchain_confirmaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bloque_id` (`bloque_id`),
  ADD KEY `nodo_id` (`nodo_id`);

--
-- Indices de la tabla `blockchain_nodos`
--
ALTER TABLE `blockchain_nodos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `compradores_info`
--
ALTER TABLE `compradores_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `contratos`
--
ALTER TABLE `contratos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lote_id` (`lote_id`),
  ADD KEY `agricultor_id` (`agricultor_id`),
  ADD KEY `comprador_id` (`comprador_id`),
  ADD KEY `analista_id` (`analista_id`);

--
-- Indices de la tabla `lotes`
--
ALTER TABLE `lotes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `agricultor_id` (`agricultor_id`);

--
-- Indices de la tabla `metricas_sistema`
--
ALTER TABLE `metricas_sistema`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `transporte`
--
ALTER TABLE `transporte`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contrato_id` (`contrato_id`),
  ADD KEY `transportista_id` (`transportista_id`);

--
-- Indices de la tabla `transportistas_info`
--
ALTER TABLE `transportistas_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `trazabilidad`
--
ALTER TABLE `trazabilidad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contrato_id` (`contrato_id`),
  ADD KEY `lote_id` (`lote_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `agricultores_info`
--
ALTER TABLE `agricultores_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `blockchain_blocks`
--
ALTER TABLE `blockchain_blocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `blockchain_confirmaciones`
--
ALTER TABLE `blockchain_confirmaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `blockchain_nodos`
--
ALTER TABLE `blockchain_nodos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `compradores_info`
--
ALTER TABLE `compradores_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `contratos`
--
ALTER TABLE `contratos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `lotes`
--
ALTER TABLE `lotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `metricas_sistema`
--
ALTER TABLE `metricas_sistema`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `transporte`
--
ALTER TABLE `transporte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `transportistas_info`
--
ALTER TABLE `transportistas_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `trazabilidad`
--
ALTER TABLE `trazabilidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `agricultores_info`
--
ALTER TABLE `agricultores_info`
  ADD CONSTRAINT `agricultores_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `blockchain_blocks`
--
ALTER TABLE `blockchain_blocks`
  ADD CONSTRAINT `blockchain_blocks_ibfk_1` FOREIGN KEY (`contrato_id`) REFERENCES `contratos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `blockchain_confirmaciones`
--
ALTER TABLE `blockchain_confirmaciones`
  ADD CONSTRAINT `blockchain_confirmaciones_ibfk_1` FOREIGN KEY (`bloque_id`) REFERENCES `blockchain_blocks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blockchain_confirmaciones_ibfk_2` FOREIGN KEY (`nodo_id`) REFERENCES `blockchain_nodos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `compradores_info`
--
ALTER TABLE `compradores_info`
  ADD CONSTRAINT `compradores_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `contratos`
--
ALTER TABLE `contratos`
  ADD CONSTRAINT `contratos_ibfk_1` FOREIGN KEY (`lote_id`) REFERENCES `lotes` (`id`),
  ADD CONSTRAINT `contratos_ibfk_2` FOREIGN KEY (`agricultor_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `contratos_ibfk_3` FOREIGN KEY (`comprador_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `contratos_ibfk_4` FOREIGN KEY (`analista_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `lotes`
--
ALTER TABLE `lotes`
  ADD CONSTRAINT `lotes_ibfk_1` FOREIGN KEY (`agricultor_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `transporte`
--
ALTER TABLE `transporte`
  ADD CONSTRAINT `transporte_ibfk_1` FOREIGN KEY (`contrato_id`) REFERENCES `contratos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transporte_ibfk_2` FOREIGN KEY (`transportista_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `transportistas_info`
--
ALTER TABLE `transportistas_info`
  ADD CONSTRAINT `transportistas_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `trazabilidad`
--
ALTER TABLE `trazabilidad`
  ADD CONSTRAINT `trazabilidad_ibfk_1` FOREIGN KEY (`contrato_id`) REFERENCES `contratos` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `trazabilidad_ibfk_2` FOREIGN KEY (`lote_id`) REFERENCES `lotes` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
