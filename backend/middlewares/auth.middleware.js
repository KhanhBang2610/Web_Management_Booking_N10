// Kiểm tra JWT Token xem user có quyền truy cập không.

const jwt = require('jsonwebtoken');

// 1. Middleware kiểm tra Token hợp lệ (Đã đăng nhập)
const verifyToken = (req, res, next) => {
    // Lấy token từ header của request (Định dạng chuẩn: Bearer <token>)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: 'Truy cập bị từ chối. Vui lòng cung cấp token đăng nhập.' 
        });
    }

    // Tách lấy chuỗi token nằm sau chữ 'Bearer '
    const token = authHeader.split(' ')[1];

    try {
        // Giải mã token bằng Secret Key trong file .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gắn payload của token (bao gồm id, role) vào đối tượng request
        // Để các Controller phía sau có thể lấy ra dùng (VD: req.user.id)
        req.user = decoded;
        
        // Cho phép request đi tiếp tới Controller
        next(); 
    } catch (error) {
        console.error('Lỗi xác thực token:', error.message);
        
        // Phân loại lỗi token để báo cho Frontend
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
        }
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã bị thay đổi.' });
    }
};

// 2. Middleware Phân quyền (Role-based access control)
// Sử dụng toán tử rest (...) để nhận vào một mảng các role được phép
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Kiểm tra xem role của user hiện tại có nằm trong danh sách cho phép không
        // req.user được lấy từ kết quả của hàm verifyToken chạy trước đó
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Quyền truy cập bị từ chối. Chỉ có [${allowedRoles.join(', ')}] mới được thực hiện hành động này.` 
            });
        }
        
        // Nếu role hợp lệ, cho phép đi tiếp
        next();
    };
};

module.exports = {
    verifyToken,
    authorizeRoles
};