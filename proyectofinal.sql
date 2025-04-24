-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 18-04-2025 a las 22:17:55
-- Versión del servidor: 8.0.41
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyectofinal`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `precio`) VALUES
(13, 'pc ', 50000.00),
(15, 'cargador ', 190.00),
(16, 'USB ', 50.00),
(18, 'cargador ', 34353.00),
(19, 'carpeta', 299.00),
(20, 'carro', 333.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('cliente','admin') NOT NULL DEFAULT 'cliente',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(5, 'admin01', '$2a$10$hMT1HdU2oAHyZtKAn5d2z.0a8qBZZLQ2DUNjUE4NcBSHaH/8UnmJG', 'admin', '2025-04-18 15:56:29'),
(6, 'admin02', '$2a$10$0HSkv4ZgiEVt05.Nv4B0MOX2PTWzmTrR3RPi3M6DsC1BodJ4Xb3lO', 'admin', '2025-04-18 15:57:46'),
(7, 'adixon', '$2b$10$9jR4A9XpRJQcN6Tf6iyiQOi5SUNPM2GUnxJSek1FhXu23Uvs5C5IC', 'admin', '2025-04-18 16:11:15'),
(8, 'esmerlada', '$2b$10$thpHn7JntuSqBydQ08pPuOvhu.Hqgawuw9VLIO9hPY.wzwWODD5u2', 'admin', '2025-04-18 16:15:04'),
(9, 'rodrigo', '$2b$10$ekx7B5rji5goTlsuU5VJu.IfLCqVWvxTs8MNKNN9dN4E0..UHQPce', 'cliente', '2025-04-18 16:21:27'),
(17, 'adixonrr', '$2b$10$D4Fl8Ddt1jm574X5pOI4V.wV71/Y5sZ3KZgXwpaxt4tyQtCUBtaHC', 'cliente', '2025-04-18 16:50:59'),
(18, 'adixonjulca', '$2b$10$m.ek/ZRyh8eQoYnhZ8Bwku11wHYZwbRwLKdJpXLavmyDWD8AN5zjy', 'cliente', '2025-04-18 16:51:51'),
(19, 'adixonadmin', '$2b$10$m3UmUNwM33zFyVWtZPkmi.7llrvwXBaVeV5uqrBYc/hwzjIo62Oue', 'admin', '2025-04-18 16:52:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int NOT NULL,
  `id_producto` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `fecha` datetime NOT NULL,
  `cantidad` int NOT NULL,
  `nombre_cliente` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `id_producto`, `total`, `fecha`, `cantidad`, `nombre_cliente`) VALUES
(14, 13, 450000.00, '2025-04-12 11:15:32', 9, 'adixon julca'),
(15, 16, 200.00, '2025-04-12 11:31:19', 4, 'adixon'),
(16, 15, 760.00, '2025-04-12 11:45:24', 4, 'esmerlada');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_producto` (`id_producto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `fk_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
