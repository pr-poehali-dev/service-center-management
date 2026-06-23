CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    device_model VARCHAR(255) NOT NULL,
    issue TEXT,
    master VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'diag',
    price INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO orders (client_name, client_phone, device_type, device_model, issue, master, status, price) VALUES
('Анна Кравцова', '+7 999 120-44-10', 'laptop', 'MacBook Pro 14"', 'Не включается, залит жидкостью', 'И. Петров', 'repair', 12400),
('Дмитрий Лосев', '+7 916 553-21-08', 'phone', 'iPhone 14 Pro', 'Замена экрана', 'А. Сидоров', 'ready', 8900),
('ООО «Вектор»', '+7 495 778-90-12', 'pc', 'ПК сборка ATX', 'Не загружается система', 'И. Петров', 'diag', 0),
('Олег Минин', '+7 903 441-77-65', 'phone', 'Samsung Galaxy S23', 'Не заряжается', 'А. Сидоров', 'wait', 6200),
('Марина Гусь', '+7 921 309-55-44', 'laptop', 'Asus ROG Strix', 'Перегрев, чистка системы охлаждения', 'К. Орлова', 'repair', 15700);