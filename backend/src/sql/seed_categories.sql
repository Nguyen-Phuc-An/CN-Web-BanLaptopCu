USE used_laptops;

INSERT INTO categories (name, slug, parent_id) VALUES
('Laptop','laptop', NULL),
('Apple MacBook','macbook', 1),
('Dell','dell', 1),
('HP','hp', 1),
('Lenovo','lenovo', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);