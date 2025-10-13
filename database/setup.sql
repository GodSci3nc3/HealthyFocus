-- Comandos para configurar MySQL para HealthyFocus

-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS healthyfocus;

-- 2. Crear el usuario 'arthur' con contraseña '25355'
CREATE USER IF NOT EXISTS 'arthur'@'localhost' IDENTIFIED BY '25355';

-- 3. Dar todos los permisos al usuario sobre la base de datos
GRANT ALL PRIVILEGES ON healthyfocus.* TO 'arthur'@'localhost';

-- 4. Aplicar los cambios
FLUSH PRIVILEGES;

-- 5. Usar la base de datos
USE healthyfocus;

-- 6. Crear la tabla users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Crear la tabla projects
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Crear la tabla tasks
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pendiente', 'en_proceso', 'completada') DEFAULT 'pendiente',
    priority ENUM('baja', 'media', 'alta') DEFAULT 'media',
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. Crear la tabla notes
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Verificar que las tablas se crearon correctamente
SHOW TABLES;
DESCRIBE users;
DESCRIBE projects;
DESCRIBE tasks;
DESCRIBE notes;