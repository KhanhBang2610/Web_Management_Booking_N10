-- Script insert các dữ liệu mẫu (dummy data) như danh sách vài khách sạn, tỉnh thành, user test để dễ dàng phát triển giao diện.

USE agoda_clone_db;

-- 1. BỔ SUNG ĐỊA ĐIỂM (LOCATIONS)
INSERT INTO locations (name, description, image_url) VALUES 
('Phú Quốc', 'Đảo ngọc với những bãi biển trắng mịn và hoàng hôn tuyệt đẹp.', 'phu_quoc.jpg'),
('Nha Trang', 'Thành phố biển năng động với vịnh biển đẹp nhất thế giới.', 'nha_trang.jpg'),
('Hội An', 'Phố cổ lung linh ánh đèn lồng và nét văn hóa di sản.', 'hoi_an.jpg'),
('Hà Nội', 'Thủ đô ngàn năm văn hiến với nét ẩm thực độc đáo.', 'ha_noi.jpg'),
('Đà Nẵng', 'Thành phố của những cây cầu và bãi biển Mỹ Khê.', 'da_nang.jpg');

-- 2. BỔ SUNG NGƯỜI DÙNG (USERS)
-- Mật khẩu mẫu đã hash (tương ứng với 'password123')
INSERT INTO users (full_name, email, password_hash, role, phone) VALUES 
('Admin Hệ Thống', 'admin@agoda.com', '$2b$10$K7.t8MhY7mQ0P0O.fU8kUe1zGz5yJ6xW8vB9uA0C1D2E3F4G5H6I', 'Admin'),
('Nguyễn Văn A', 'customer1@gmail.com', '$2b$10$K7.t8MhY7mQ0P0O.fU8kUe1zGz5yJ6xW8vB9uA0C1D2E3F4G5H6I', 'Customer', '0901234567'),
('Trần Thị B', 'customer2@gmail.com', '$2b$10$K7.t8MhY7mQ0P0O.fU8kUe1zGz5yJ6xW8vB9uA0C1D2E3F4G5H6I', 'Customer', '0907654321'),
('Lê Hoàng Nam', 'host_phuquoc@gmail.com', '$2b$10$K7.t8MhY7mQ0P0O.fU8kUe1zGz5yJ6xW8vB9uA0C1D2E3F4G5H6I', 'Host', '0911223344'),
('Phạm Minh Đức', 'host_danang@gmail.com', '$2b$10$K7.t8MhY7mQ0P0O.fU8kUe1zGz5yJ6xW8vB9uA0C1D2E3F4G5H6I', 'Host', '0988776655');

-- 3. BỔ SUNG KHÁCH SẠN/CĂN HỘ (PROPERTIES)
-- Giả sử ID locations: 4-Phú Quốc, 5-Nha Trang, 6-Hội An, 7-Hà Nội, 8-Đà Nẵng
-- Giả sử ID hosts: 3-Lê Hoàng Nam, 4-Phạm Minh Đức
INSERT INTO properties (name, address, description, star_rating, location_id, owner_id) VALUES 
('Vinpearl Resort & Spa', 'Bãi Dài, Gành Dầu, Phú Quốc', 'Khu nghỉ dưỡng sang trọng với hồ bơi vô cực.', 5, 4, 3),
('InterContinental Danang', 'Bán đảo Sơn Trà, Đà Nẵng', 'Thiết kế độc đáo giữa thiên nhiên hoang sơ.', 5, 8, 4),
('Hội An Memories Resort', 'Cồn Hến, Hội An', 'Không gian yên bình bên dòng sông Hoài.', 4, 6, 3),
('Silk Path Boutique Hanoi', 'Hoàn Kiếm, Hà Nội', 'Khách sạn phong cách Pháp ngay trung tâm thủ đô.', 4, 7, 4),
('Panorama Nha Trang', '02 Nguyễn Thị Minh Khai, Nha Trang', 'Căn hộ view biển trực diện cực đẹp.', 4, 5, 3);

-- 4. BỔ SUNG LOẠI PHÒNG (ROOMS)
INSERT INTO rooms (property_id, room_type, base_price, capacity, total_rooms) VALUES 
(3, 'Villa Hướng Biển', 8500000, 2, 5),
(3, 'Phòng Deluxe Garden', 3200000, 2, 20),
(4, 'Classic Room', 5500000, 2, 15),
(4, 'King Suite Ocean View', 12000000, 3, 3),
(5, 'Superior Twin', 2200000, 2, 25),
(6, 'Premium City View', 1800000, 2, 10),
(7, 'Studio Ocean Front', 1500000, 2, 40);

-- 5. BỔ SUNG ĐÁNH GIÁ (REVIEWS)
INSERT INTO reviews (property_id, user_id, rating, comment) VALUES 
(3, 3, 5, 'Trải nghiệm tuyệt vời, nhân viên rất tận tình!'),
(3, 4, 4, 'Hồ bơi đẹp nhưng đồ ăn sáng hơi ít món.'),
(4, 3, 5, 'Đẳng cấp thế giới, view từ phòng nhìn ra biển rất đỉnh.'),
(7, 4, 3, 'Phòng sạch sẽ nhưng thang máy hơi chậm vào giờ cao điểm.');

-- 6. BỔ SUNG ĐƠN ĐẶT PHÒNG MẪU (BOOKINGS)
-- Dùng để test logic phòng trống
INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, total_price, status) VALUES 
(3, 4, '2026-05-01', '2026-05-05', 12800000, 'Confirmed'),
(4, 8, '2026-06-10', '2026-06-12', 3600000, 'Pending');