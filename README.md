# Web_Management_Booking_N10
Dự án Website quản lý đặt phòng khách sạn, căn hộ được xây dựng theo mô hình Fullstack (Node.js & React).

## 🛠 Công nghệ sử dụng
- **Frontend:**
- **Backend:** Node.js, Express, Multer (Upload file).
- **Database:** MySQL.

## 📂 Cấu trúc tổng thể của dự án (Root Directory)
```
/Web_Management_Booking_N10
├── /database       # Chứa các script SQL khởi tạo và mock data
├── /backend        # Chứa toàn bộ mã nguồn API (Node.js)
├── /frontend       # Chứa toàn bộ mã nguồn giao diện (React/JS)
├── .gitignore      # Cấu hình bỏ qua các file không đưa lên GitHub (node_modules, .env)
└── README.md       # Tài liệu hướng dẫn cài đặt và chạy dự án
```

## 📂 1. Phần Cơ sở dữ liệu (Database / MySQL)
```
/database
├── init_schema.sql      # Script tạo cấu trúc các bảng (Users, Properties, Rooms, Bookings...) và thiết lập khóa ngoại (Foreign Keys).
├── seed_data.sql        # Script insert các dữ liệu mẫu (dummy data) như danh sách vài khách sạn, tỉnh thành, user test để dễ dàng phát triển giao diện.
└── migrations/          # (Tùy chọn) Thư mục chứa các file cập nhật cấu trúc DB theo từng giai đoạn phát triển để không làm mất dữ liệu cũ.
```

## 📂 2. Phần Backend (BE - Node.js & Express)
```
/backend
├── /config
│   ├── db.config.js       # Khởi tạo kết nối với MySQL (sử dụng mysql2 hoặc Sequelize/Knex).
│   └── cloudinary.js      # Cấu hình dịch vụ lưu trữ ảnh đám mây (nếu có).
├── /controllers
│   ├── auth.controller.js # Xử lý logic Đăng ký, Đăng nhập, Quên mật khẩu.
│   ├── property.controller.js # Xử lý request lấy danh sách khách sạn, tìm kiếm theo bộ lọc.
│   └── booking.controller.js  # Xử lý luồng đặt phòng, tính tiền, kiểm tra phòng trống.
├── /models                # Lớp giao tiếp trực tiếp với MySQL (định nghĩa table, query)
│   ├── user.model.js      # Các hàm query liên quan đến user (findById, create...).
│   ├── property.model.js  # Các hàm query khách sạn, join với bảng Location/Rooms.
│   └── booking.model.js   # Các hàm query tạo đơn đặt phòng, cập nhật trạng thái.
├── /routes                # Định nghĩa các endpoint API
│   ├── auth.routes.js     # e.g., POST /api/auth/login
│   ├── property.routes.js # e.g., GET /api/properties/search
│   └── booking.routes.js  # e.g., POST /api/bookings/create
├── /middlewares
│   ├── auth.middleware.js # Kiểm tra JWT Token xem user có quyền truy cập không.
│   ├── upload.middleware.js # Cấu hình Multer để xử lý file/hình ảnh upload từ client.
│   └── error.middleware.js  # Bắt và trả về lỗi chuẩn hóa cho toàn bộ hệ thống.
├── /utils                 # Các hàm tiện ích dùng chung
│   ├── generateToken.js   # Hàm tạo JWT.
│   └── formatDate.js      # Hàm xử lý định dạng ngày tháng check-in/out.
├── .env                   # Lưu các biến môi trường bảo mật (DB_PASSWORD, JWT_SECRET).
├── server.js              # File gốc khởi chạy server Express, gộp các routes.
└── package.json           # Danh sách các thư viện BE (express, mysql2, bcrypt, multer...)
```

## 📂 3. Phần Frontend (FE - React/JS)
```
/frontend
├── /public
│   ├── index.html         # File HTML gốc.
│   └── favicon.ico        # Icon trên tab trình duyệt.
├── /src
│   ├── /assets            # File tĩnh
│   │   ├── images/        # Logo, placeholder images.
│   │   └── styles/        # CSS/SCSS global (variables, reset css).
│   ├── /components        # Component dùng chung
│   │   ├── layout/        # Navbar.jsx, Footer.jsx, Sidebar.jsx (cho Host).
│   │   ├── ui/            # Button.jsx, Modal.jsx, LoadingSpinner.jsx, InputCard.jsx.
│   │   └── search/        # SearchBar.jsx, DatePicker.jsx, GuestSelector.jsx.
│   ├── /pages             # Các màn hình chính
│   │   ├── Home.jsx       # Trang chủ (Banner, thanh tìm kiếm, điểm đến nổi bật).
│   │   ├── SearchResult.jsx # Trang danh sách khách sạn (kết hợp bộ lọc bên trái).
│   │   ├── PropertyDetail.jsx # Trang chi tiết 1 khách sạn (Thư viện ảnh, mô tả, chọn phòng).
│   │   ├── Checkout.jsx   # Nhập thông tin thanh toán, xác nhận đơn.
│   │   └── HostDashboard.jsx # Dành cho chủ nhà quản lý phòng (đăng phòng, up ảnh).
│   ├── /services          # Gọi API từ Backend
│   │   ├── api.js         # Cấu hình Axios instance (base URL, gán token vào header).
│   │   ├── auth.service.js # Các hàm gọi API liên quan auth.
│   │   └── property.service.js # Các hàm gọi API fetch danh sách, lấy chi tiết.
│   ├── /store             # Quản lý Global State (ví dụ dùng Context API hoặc Redux)
│   │   ├── AuthContext.js # Lưu trạng thái user đang đăng nhập.
│   │   └── SearchContext.js # Lưu trữ tạm thời ngày đi/về, địa điểm đang tìm kiếm.
│   ├── /hooks             # Custom hooks (nếu dùng React)
│   │   └── useFetch.js    # Hook tự viết để gọi dữ liệu và quản lý loading/error state.
│   ├── /utils
│   │   └── currencyFormatter.js # Hàm format tiền VNĐ.
│   ├── App.jsx            # Cấu hình Router (gắn các Pages vào các đường dẫn URL).
│   └── index.js           # File entry point render giao diện ra cây DOM.
├── .env                   # Chứa biến môi trường FE (REACT_APP_API_URL).
└── package.json           # Thư viện FE (react, axios, react-router-dom...).
```

## 🚀 Hướng dẫn cài đặt (Local Setup)
```
update sau
```