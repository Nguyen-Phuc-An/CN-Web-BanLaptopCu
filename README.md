# CN-Web-BanLaptopCu

Project: Website mua bán laptop cũ (frontend + backend + MySQL).  
Tài liệu ngắn gọn để thiết lập, chạy, seed admin và xử lý lỗi phổ biến.

## Yêu cầu
- Node.js >= 16
- npm hoặc pnpm
- MySQL (local)
- PowerShell (Windows) hoặc bash

## Cấu trúc chính
- backend/ — server Express, models, migrations, scripts
- frontend/ — React app (Vite)
- backend/src/sql/schema.sql — schema gốc
- backend/src/sql/migrations/ — migrations SQL hữu ích

## Biến môi trường (ví dụ .env trong backend)
Tạo file `backend/.env`:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=used_laptops
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
```

## Thiết lập database
1. Tạo DB và bảng (nếu chưa có)
- Dùng MySQL Workbench hoặc CLI:
```powershell
mysql -u root -p < backend/src/sql/schema.sql
```

2. Nếu cần thêm cột (ví dụ `updated_at`, `address`, đặt `phone` NOT NULL):
- Mở MySQL client và chạy các ALTER/UPDATE đã thảo luận:
```sql
USE used_laptops;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT AFTER phone;
UPDATE users SET phone = COALESCE(NULLIF(phone, ''), '0000000000') WHERE phone IS NULL OR phone = '';
UPDATE users SET address = COALESCE(NULLIF(address, ''), 'N/A') WHERE address IS NULL OR address = '';
ALTER TABLE users MODIFY COLUMN phone VARCHAR(30) NOT NULL, MODIFY COLUMN address TEXT NOT NULL;
```
(Lưu ý: nếu MySQL cũ không hỗ trợ `IF NOT EXISTS`, kiểm tra `information_schema` trước khi ALTER.)

## Backend — chạy server
1. Cài dependencies:
```powershell
cd C:\CN-Web-BanLaptopCu\backend
npm install
```
2. Khởi động dev:
```powershell
npm run dev
```
3. Nếu cần restart sau thay đổi .env hoặc schema, dừng và chạy lại.

## Frontend — chạy dev
1. Cài dependencies:
```powershell
cd C:\CN-Web-BanLaptopCu\frontend
npm install
```
2. Chạy:
```powershell
npm run dev
# mặc định Vite trên http://localhost:5173
```

## Seed / đặt mật khẩu admin
Nếu repo có script seed, ví dụ:
```powershell
cd C:\CN-Web-BanLaptopCu\backend
node .\scripts\set-admin-password.js admin123 admin@example.com
```
Hoặc cập nhật trực tiếp user trong DB bằng bcrypt hash:
```powershell
node -e "console.log(require('bcryptjs').hashSync('admin123',12))"
# copy hash và update:
mysql -u root -p -e "USE used_laptops; UPDATE users SET password='PASTE_HASH' WHERE email='admin@example.com';"
```

## Test API (Windows PowerShell)
PowerShell có alias `curl` → dùng `curl.exe` hoặc `Invoke-RestMethod`.

- curl.exe:
```powershell
curl.exe -i -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"password\":\"admin123\"}"
```

- Invoke-RestMethod:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -ContentType "application/json" -Body (ConvertTo-Json @{ email='admin@example.com'; password='admin123' })
```

## Vấn đề phổ biến & cách khắc phục nhanh
- {"error":"email and password required"}  
  Nguyên nhân: payload gửi không đúng. Kiểm tra `frontend/src/services/auth.js` — hàm `login` phải gửi `{ email, password }`. Dùng DevTools → Network → kiểm tra Request Payload.

- {"error":"email exists"} (409)  
  Email đã tồn tại. Kiểm tra DB:
  ```sql
  SELECT id,email,phone,address FROM users WHERE email='the-email' \G
  ```
  Xóa hoặc đổi email nếu cần.

- {"error":"Unknown column 'updated_at' in 'field list'"}  
  DB chưa có cột `updated_at`. Thêm cột bằng ALTER (xem phần DB ở trên).

- {"error":"Expected property name or '}' in JSON..."} hoặc lỗi parse JSON  
  Truyền body không đúng JSON (PowerShell quoting). Dùng `curl.exe` với escape `\"` hoặc `Invoke-RestMethod`/`ConvertTo-Json`.

- Kiểm tra server logs  
  Nếu server trả 500, xem terminal backend để biết stacktrace/logs (authController đã có console.log debug theo patches trước).

## Frontend styling
- CSS modal: `frontend/src/styles/AuthModal.css`  
- Home page styles: `frontend/src/styles/Home.css`
Import các file này trong component tương ứng (đã cập nhật).

## Mẹo debug
- Mở DevTools → Network → chọn request → xem Payload, Response, Headers.
- Kiểm tra backend console logs (đã thêm logs cho register/login).
- SHOW CREATE TABLE users\G để xác nhận schema.

## Muốn tôi làm tiếp?
Gửi yêu cầu cụ thể:
- Tạo migration file trong repo (tôi có thể tạo patch).
- Sửa `services/auth.js` hoặc `AuthModal.jsx`.
- Xoá/seed user trong DB giúp bạn (tôi cung cấp lệnh).