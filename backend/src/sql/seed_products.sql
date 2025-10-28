USE used_laptops;

-- Ví dụ sản phẩm mẫu (giả sử category_id = 2 là macbook, seller_id = 2)

INSERT INTO products (seller_id, category_id, title, slug, description, `condition`, price, currency, stock)
VALUES (14, 2, 'MacBook Pro 2019 13-inch - i5 8GB 256GB', 'mbp-2019-13-i5-8-256', 'Tình trạng tốt, pin 85%', 'good', 15000000.00, 'VND', 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO product_images (product_id, url, is_primary) VALUES
(LAST_INSERT_ID(), 'https://example.com/images/mbp2019-1.jpg', 1);