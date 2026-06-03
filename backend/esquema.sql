-- Estructura de la Base de Datos

CREATE TABLE `compra_evento` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `usuario_id` binary(16) NOT NULL,
  `evento_id` binary(16) NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `precio_pagado` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `evento_id` (`evento_id`),
  CONSTRAINT `compra_evento_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `compra_evento_ibfk_4` FOREIGN KEY (`evento_id`) REFERENCES `evento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `compra_paquete` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `usuario_id` binary(16) NOT NULL,
  `paquete_id` binary(16) NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `precio_pagado` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `paquete_id` (`paquete_id`),
  CONSTRAINT `compra_paquete_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `compra_paquete_ibfk_4` FOREIGN KEY (`paquete_id`) REFERENCES `paquete` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `compra_suscripcion` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `usuario_id` binary(16) NOT NULL,
  `suscripcion_id` binary(16) NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `precio_pagado` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `suscripcion_id` (`suscripcion_id`),
  CONSTRAINT `compra_suscripcion_ibfk_5` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `compra_suscripcion_ibfk_6` FOREIGN KEY (`suscripcion_id`) REFERENCES `suscripcion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `evento` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `paleta_colores` varchar(255) DEFAULT 'default',
  `tipografia` varchar(255) DEFAULT 'sans-serif',
  `estilo_grafico` varchar(255) DEFAULT 'minimalista',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `invitacion` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `usuario_id` binary(16) NOT NULL,
  `plantilla_id` binary(16) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `mensaje` varchar(255) NOT NULL,
  `fecha_evento` date NOT NULL,
  `lugar` varchar(255) NOT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('borrador','publicada','enviada') DEFAULT 'borrador',
  `datos_extra` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `plantilla_id` (`plantilla_id`),
  CONSTRAINT `invitacion_ibfk_5` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `invitacion_ibfk_6` FOREIGN KEY (`plantilla_id`) REFERENCES `plantilla` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `invitado` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `invitacion_id` binary(16) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `estado` enum('pendiente','confirmado','rechazado') DEFAULT 'pendiente',
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`,`invitacion_id`),
  UNIQUE KEY `invitado_correo_invitacion_id` (`correo`,`invitacion_id`),
  KEY `invitacion_id` (`invitacion_id`),
  CONSTRAINT `invitado_ibfk_1` FOREIGN KEY (`invitacion_id`) REFERENCES `invitacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `paquete` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `precio` decimal(6,2) NOT NULL,
  `evento_id` binary(16) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `evento_id` (`evento_id`),
  CONSTRAINT `paquete_ibfk_1` FOREIGN KEY (`evento_id`) REFERENCES `evento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `plantilla` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `titulo` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `plantilla_paquete` (
  `plantilla_id` binary(16) NOT NULL,
  `paquete_id` binary(16) NOT NULL,
  PRIMARY KEY (`plantilla_id`,`paquete_id`),
  KEY `fk_plantilla_paquete_paquete` (`paquete_id`),
  CONSTRAINT `fk_plantilla_paquete_paquete` FOREIGN KEY (`paquete_id`) REFERENCES `paquete` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_plantilla_paquete_plantilla` FOREIGN KEY (`plantilla_id`) REFERENCES `plantilla` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sugerencia` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `evento_id` binary(16) DEFAULT NULL,
  `paquete_id` binary(16) DEFAULT NULL,
  `titulo_campo` varchar(255) NOT NULL,
  `descripcion_sugerida` varchar(255) DEFAULT NULL,
  `tipo_campo` enum('texto','textarea','url','fecha','numero','boolean') DEFAULT 'texto',
  `obligatorio` tinyint(1) DEFAULT '0',
  `orden` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `evento_id` (`evento_id`),
  KEY `paquete_id` (`paquete_id`),
  CONSTRAINT `sugerencia_ibfk_7` FOREIGN KEY (`evento_id`) REFERENCES `evento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sugerencia_ibfk_8` FOREIGN KEY (`paquete_id`) REFERENCES `paquete` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `suscripcion` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `usuario_id` binary(16) NOT NULL,
  `tipo` enum('mensual_1','mensual_3','mensual_6','anual','ilimitada') NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` enum('activa','vencida','cancelada') DEFAULT 'activa',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `suscripcion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `usuario` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `nombre` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `fecha_nacimiento` date NOT NULL,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `rol` varchar(255) DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `correo_2` (`correo`),
  UNIQUE KEY `correo_3` (`correo`),
  UNIQUE KEY `correo_4` (`correo`),
  UNIQUE KEY `correo_5` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

