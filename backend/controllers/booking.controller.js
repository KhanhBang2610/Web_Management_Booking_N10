// Xử lý luồng đặt phòng, tính tiền, kiểm tra phòng trống.

const db = require('../config/db.config');

// Hàm bổ trợ: Tính số ngày giữa 2 mốc thời gian
const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
};

// 1. Kiểm tra phòng trống (Check Availability)
const checkAvailability = async (req, res) => {
    try {
        const { room_id, check_in_date, check_out_date } = req.body;

        // B1: Lấy tổng số lượng của loại phòng này trong bảng rooms
        const [roomData] = await db.query('SELECT total_rooms FROM rooms WHERE id = ?', [room_id]);
        if (roomData.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy loại phòng này.' });
        }
        const totalRooms = roomData[0].total_rooms;

        // B2: Đếm số lượng phòng đã được đặt trong khoảng thời gian khách yêu cầu
        // Logic Overlap: Lịch cũ Check-in < Lịch mới Check-out VÀ Lịch cũ Check-out > Lịch mới Check-in
        const [bookedData] = await db.query(
            `SELECT COUNT(id) as booked_count 
             FROM bookings 
             WHERE room_id = ? 
             AND status != 'Cancelled'
             AND check_in_date < ? 
             AND check_out_date > ?`,
            [room_id, check_out_date, check_in_date]
        );

        const bookedCount = bookedData[0].booked_count;
        const availableRooms = totalRooms - bookedCount;

        if (availableRooms > 0) {
            return res.status(200).json({ 
                isAvailable: true, 
                availableRooms: availableRooms,
                message: 'Phòng còn trống!' 
            });
        } else {
            return res.status(200).json({ 
                isAvailable: false, 
                availableRooms: 0,
                message: 'Rất tiếc, loại phòng này đã hết trong khoảng thời gian bạn chọn.' 
            });
        }

    } catch (error) {
        console.error('Lỗi API checkAvailability:', error);
        res.status(500).json({ message: 'Lỗi server khi kiểm tra phòng trống.' });
    }
};

// 2. Tạo đơn đặt phòng mới (Create Booking)
const createBooking = async (req, res) => {
    // Để đảm bảo tính toàn vẹn dữ liệu, trong thực tế sẽ dùng Transaction (BEGIN, COMMIT, ROLLBACK).
    // Ở đây viết logic cơ bản để bạn nắm luồng trước.
    const connection = await db.getConnection(); 

    try {
        await connection.beginTransaction();

        const { room_id, check_in_date, check_out_date } = req.body;
        // user_id thường được lấy từ req.user (do middleware verify JWT gắn vào)
        const user_id = req.user.id; 

        // B1: Phải kiểm tra lại phòng trống một lần nữa trước khi chốt đơn
        // Tránh trường hợp khách ngâm ở trang thanh toán quá lâu
        const [roomData] = await connection.query('SELECT base_price, total_rooms FROM rooms WHERE id = ?', [room_id]);
        if (roomData.length === 0) throw new Error('Không tìm thấy phòng.');

        const [bookedData] = await connection.query(
            `SELECT COUNT(id) as booked_count FROM bookings 
             WHERE room_id = ? AND status != 'Cancelled' AND check_in_date < ? AND check_out_date > ? FOR UPDATE`, 
             // FOR UPDATE: Lock dòng dữ liệu này lại, ngăn các transaction khác đọc/ghi cùng lúc
            [room_id, check_out_date, check_in_date]
        );

        if (roomData[0].total_rooms - bookedData[0].booked_count <= 0) {
            throw new Error('Phòng đã được đặt bởi người khác trong lúc bạn đang thao tác.');
        }

        // B2: Tính tổng tiền (Số đêm * Giá phòng)
        const nights = calculateNights(check_in_date, check_out_date);
        const totalPrice = nights * roomData[0].base_price;

        // B3: Lưu đơn đặt phòng vào Database
        const [result] = await connection.query(
            `INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, total_price, status) 
             VALUES (?, ?, ?, ?, ?, 'Pending')`, // Trạng thái ban đầu là Pending chờ thanh toán
            [user_id, room_id, check_in_date, check_out_date, totalPrice]
        );

        await connection.commit(); // Hoàn tất giao dịch

        res.status(201).json({
            message: 'Tạo đơn đặt phòng thành công!',
            bookingId: result.insertId,
            totalPrice: totalPrice
        });

    } catch (error) {
        await connection.rollback(); // Nếu có lỗi xảy ra ở bất kỳ bước nào, hoàn tác toàn bộ
        console.error('Lỗi API createBooking:', error);
        res.status(400).json({ message: error.message || 'Lỗi server khi đặt phòng.' });
    } finally {
        connection.release(); // Trả connection lại cho Pool
    }
};

// 3. Lấy lịch sử đặt phòng của người dùng (Get User Bookings)
const getUserBookings = async (req, res) => {
    try {
        const user_id = req.user.id; // Lấy từ token đăng nhập

        const [bookings] = await db.query(
            `SELECT b.id as booking_id, b.check_in_date, b.check_out_date, b.total_price, b.status, 
                    r.room_type, p.name as property_name, p.address 
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             JOIN properties p ON r.property_id = p.id
             WHERE b.user_id = ?
             ORDER BY b.check_in_date DESC`,
            [user_id]
        );

        res.status(200).json({
            message: 'Lấy lịch sử thành công',
            data: bookings
        });
    } catch (error) {
        console.error('Lỗi API getUserBookings:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy lịch sử đặt phòng.' });
    }
};

module.exports = {
    checkAvailability,
    createBooking,
    getUserBookings
};