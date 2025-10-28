-- ==============================
-- CƠ SỞ DỮ LIỆU WEBSITE BÁN LAPTOP CŨ
-- ==============================

CREATE DATABASE IF NOT EXISTS used_laptops DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE used_laptops;

-- ==============================
-- 1️⃣ BẢNG NGƯỜI DÙNG (users)
-- ==============================
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','staff','customer') NOT NULL DEFAULT 'customer',
  phone VARCHAR(30) NOT NULL,
  address TEXT NOT NULL,                -- address NOT NULL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==============================
-- 2️⃣ BẢNG DANH MỤC (categories)
-- ==============================
CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  parent_id INT UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================
-- 3️⃣ BẢNG SẢN PHẨM (products)
-- ==============================
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  seller_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  specs JSON, -- nếu MySQL cũ không hỗ trợ JSON, đổi thành TEXT
  `condition` ENUM('like_new','good','fair','poor') NOT NULL DEFAULT 'good',
  price DECIMAL(12,2) NOT NULL,
  currency CHAR(3) DEFAULT 'VND',
  stock INT UNSIGNED DEFAULT 1,
  status ENUM('available','sold','hidden') DEFAULT 'available',
  posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_price (price),
  INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================
-- 4️⃣ ẢNH SẢN PHẨM (product_images)
-- ==============================
CREATE TABLE IF NOT EXISTS product_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  url VARCHAR(1000) NOT NULL,
  is_primary TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TRIGGER IF EXISTS tr_product_images_before_insert;
-- Trigger: ngăn chặn >5 ảnh cho 1 product
DELIMITER $$
CREATE TRIGGER tr_product_images_before_insert
BEFORE INSERT ON product_images
FOR EACH ROW
BEGIN
  DECLARE cnt INT;
  SELECT COUNT(*) INTO cnt FROM product_images WHERE product_id = NEW.product_id;
  IF cnt >= 5 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Maximum 5 images allowed per product';
  END IF;
END$$

DROP TRIGGER IF EXISTS tr_product_images_before_update;
CREATE TRIGGER tr_product_images_before_update
BEFORE UPDATE ON product_images
FOR EACH ROW
BEGIN
  DECLARE cnt INT;
  IF NEW.product_id <> OLD.product_id THEN
    SELECT COUNT(*) INTO cnt FROM product_images WHERE product_id = NEW.product_id;
    IF cnt >= 5 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Maximum 5 images allowed per product';
    END IF;
  END IF;
END$$
DELIMITER ;

-- ==============================
-- 5️⃣ ĐƠN HÀNG (orders)
-- ==============================
CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL, -- buyer
  total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  currency CHAR(3) DEFAULT 'VND',
  status ENUM('pending','paid','processing','shipped','completed','cancelled','refunded') NOT NULL DEFAULT 'pending',
  shipping_address TEXT,
  payment_method VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================
-- 6️⃣ CHI TIẾT ĐƠN HÀNG (order_items)
-- ==============================
CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================
-- 7️⃣ ĐÁNH GIÁ (reviews)
-- ==============================
CREATE TABLE IF NOT EXISTS reviews (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(255),
  body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_review_user_product (product_id, user_id),
  INDEX idx_reviews_product (product_id),
  INDEX idx_reviews_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================
-- 8️⃣ DANH SÁCH YÊU THÍCH (wishlists)
-- ==============================
CREATE TABLE IF NOT EXISTS wishlists (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_wishlist_user_product (user_id, product_id),
  INDEX idx_wishlist_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================
-- 9️⃣ TIN NHẮN GIỮA NGƯỜI BÁN & NGƯỜI MUA
-- ==============================
CREATE TABLE IF NOT EXISTS messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  from_user_id INT UNSIGNED NOT NULL,
  to_user_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED DEFAULT NULL,
  content TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  INDEX idx_messages_from_to (from_user_id, to_user_id),
  INDEX idx_messages_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
