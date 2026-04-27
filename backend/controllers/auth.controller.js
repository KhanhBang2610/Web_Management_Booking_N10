// Xử lý logic Đăng ký, Đăng nhập, Quên mật khẩu.

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config'); // File kết nối MySQL

// 1. Đăng ký (Register)
const register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // Kiểm tra xem email đã tồn tại trong hệ thống chưa
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email đã được sử dụng. Vui lòng chọn email khác.' });
        }

        // Mã hóa mật khẩu (hashing)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Phân quyền mặc định nếu không truyền lên là Customer
        const userRole = role || 'Customer'; 

        // Lưu thông tin vào database
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [fullName, email, hashedPassword, userRole]
        );

        res.status(201).json({ 
            message: 'Đăng ký tài khoản thành công!', 
            userId: result.insertId 
        });
    } catch (error) {
        console.error('Lỗi API Register:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ.' });
    }
};

// 2. Đăng nhập (Login)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user dựa trên email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        const user = users[0];

        // So sánh mật khẩu người dùng nhập vào với mật khẩu đã mã hóa trong DB
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        // Tạo JWT Token có thời hạn
        const token = jwt.sign(
            { id: user.id, role: user.role }, // Payload: chứa id và quyền
            process.env.JWT_SECRET,           // Secret key lấy từ file .env
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Hạn sử dụng (mặc định 7 ngày)
        );

        // Trả về token và thông tin cơ bản của user (không trả về password)
        res.status(200).json({
            message: 'Đăng nhập thành công!',
            token: token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Lỗi API Login:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ.' });
    }
};

// 3. Quên mật khẩu (Forgot Password - Phiên bản đơn giản để test)
const forgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body; 
        
        // Lưu ý: Trong thực tế, hệ thống chuẩn sẽ tạo mã OTP hoặc link gửi qua email. 
        // Sau khi xác thực OTP mới cho phép đổi. Ở đây viết logic đổi trực tiếp để bạn dễ test luồng trước.

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này.' });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật password_hash mới vào DB
        await db.query('UPDATE users SET password_hash = ? WHERE email = ?', [hashedPassword, email]);

        res.status(200).json({ message: 'Cập nhật mật khẩu mới thành công!' });
    } catch (error) {
        console.error('Lỗi API Forgot Password:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ.' });
    }
};

// Xuất các hàm ra để sử dụng trong file routes
module.exports = {
    register,
    login,
    forgotPassword
};