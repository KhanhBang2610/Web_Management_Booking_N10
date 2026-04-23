# Web_Management_Hotel_N10  (update Readme sau)

Dự án Website quản lý khách sạn trực tuyến được xây dựng theo mô hình Fullstack (Node.js & React).

## 🛠 Công nghệ sử dụng
- **Frontend:** React, Vite, React Router DOM, Lucide React.
- **Backend:** Node.js, Express, Multer (Upload file).
- **Database:** MySQL.

---

## 📂 Cấu trúc dự án

```text
📦 Web_Shop_Shoes_N12
├── 📂 backend/               # Chứa mã nguồn Server Node.js
│   ├── config/               # Cấu hình Database
│   ├── controllers/          # Xử lý Logic (Product, Order, User)
│   ├── models/               # Cấu trúc dữ liệu
│   ├── routes/               # API Routes
│   ├── uploads/              # Thư mục lưu ảnh sản phẩm upload
│   └── server.js             # Entry point (Port 5000)
│
└── 📂 web-frontend/          # Chứa mã nguồn Giao diện React
    ├── public/
    └── src/
        ├── api/              # Gọi API tới Backend
        ├── assets/           # Hình ảnh, banner, icons
        ├── components/       # Các UI Component
        ├── constants/        # Hằng số (Bảng size...)
        └── pages/            # Các trang chính

## 🚀 Hướng dẫn cài đặt (Local Setup)

### Bước 1: Khởi tạo Database
1. Mở phần mềm quản lý MySQL (Workbench, XAMPP, Laragon...).
2. Tạo một Database mới với tên là `web_shoes`.
3. Import file `shoes.sql` vào database vừa tạo.
4. Mở file mã nguồn Backend (thường là `backend/server.js` hoặc file trong `config/`), kiểm tra và cập nhật `user` cùng `password` cho khớp với MySQL trên máy của bạn.

### Bước 2: Cài đặt và chạy Backend
Mở Terminal tại thư mục gốc của dự án và chạy các lệnh sau:

    cd backend
    npm install
    node server.js

### Bước 3: Cài đặt và chạy Frontend
Mở một cửa sổ Terminal **mới** tại thư mục gốc và chạy:

    cd web-frontend
    npm install
    npm run dev
