// e.g., POST /api/bookings/create

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

// Import middleware vừa tạo
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

// Phải đăng nhập mới được đặt phòng (Ai đăng nhập cũng được)
router.post('/create', verifyToken, bookingController.createBooking);

// Lấy lịch sử đặt phòng của user đang đăng nhập
router.get('/my-bookings', verifyToken, bookingController.getUserBookings);

// (Ví dụ thêm) Chỉ có Host và Admin mới được phép tạo khách sạn mới
// router.post('/properties', verifyToken, authorizeRoles('Host', 'Admin'), propertyController.createProperty);

module.exports = router;