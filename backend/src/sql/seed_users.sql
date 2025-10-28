USE used_laptops;

-- Tạo 1 admin duy nhất. Thay <HASH_ADMIN> bằng bcrypt hash của mật khẩu (ví dụ sinh bằng: node -e "console.log(require('bcryptjs').hashSync('admin123',12))")
INSERT INTO users (email, name, password, role, phone, created_at)
VALUES
  ('admin@gmail.com', 'Admin', 'admin123', 'admin', '0363547545', NOW())
AS new
ON DUPLICATE KEY UPDATE
  name = new.name,
  password = new.password,
  role = new.role,
  phone = new.phone;