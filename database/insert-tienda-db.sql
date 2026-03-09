USE `tienda-db`;

-- 1. Roles
INSERT INTO roles (nombre) VALUES ('Admin'), ('Usuario');

-- 2. Categorías
INSERT INTO categorias (nombre) VALUES 
('Electrónica'), ('Periféricos'), ('Componentes'), ('Accesorios');

-- 3. Usuarios
INSERT INTO usuarios (nombre, correo, contrasena, rol_id) VALUES 
('admin_tienda', 'admin@tienda.com', '123456', 1),
('comprador1', 'user@tienda.com', 'user123', 2);

-- 4. Productos (imagen_url se queda en NULL)
INSERT INTO productos (codigo_unico, nombre, descripcion, precio, stock, imagen_url, categoria_id) VALUES 
('MON-001', 'Monitor Gamer 24"', 'Monitor Full HD 144Hz con panel IPS.', 199.99, 15, NULL, 1),
('TEC-002', 'Teclado Mecánico RGB', 'Switches Blue, distribución española, retroiluminado.', 59.50, 30, NULL, 2),
('RAT-003', 'Ratón Inalámbrico Pro', 'Sensor óptico 16000 DPI, batería de larga duración.', 45.00, 50, NULL, 2),
('AUR-004', 'Auriculares Noise Cancelling', 'Sonido envolvente 7.1 y micrófono retráctil.', 85.00, 20, NULL, 2),
('SSD-005', 'Disco SSD 1TB NVMe', 'Velocidad de lectura hasta 3500MB/s.', 110.00, 40, NULL, 3),
('RAM-006', 'Memoria RAM 16GB DDR4', 'Kit de 2x8GB a 3200MHz con disipador térmico.', 75.00, 25, NULL, 3),
('CAB-007', 'Cable HDMI 2.1 4K', 'Cable trenzado de alta resistencia, 2 metros.', 12.99, 100, NULL, 4),
('ALP-008', 'Alfombrilla XL RGB', 'Superficie de tela micro-texturizada con bordes luz.', 22.50, 60, NULL, 4);