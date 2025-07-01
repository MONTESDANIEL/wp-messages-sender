-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS wp_messages_queue
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

-- Usar la base de datos
USE wp_messages_queue;

-- Crear tabla para las colas
CREATE TABLE queue (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    instance VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla para los mensajes de texto
CREATE TABLE text_message (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    queue_id BIGINT NOT NULL,
    number VARCHAR(15) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (queue_id) REFERENCES Queue(id) ON DELETE CASCADE
);

-- Crear tabla para los mensajes multimedia
CREATE TABLE media_message (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    queue_id BIGINT NOT NULL,
    number VARCHAR(15) NOT NULL,
    mediatype VARCHAR(20) NOT NULL,
    media TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (queue_id) REFERENCES Queue(id) ON DELETE CASCADE
);

-- Confirmar las tablas creadas
SHOW TABLES;
