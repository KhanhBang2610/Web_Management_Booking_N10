// Bắt và trả về lỗi chuẩn hóa cho toàn bộ hệ thống.

// Middleware xử lý lỗi tập trung
const errorHandler = (err, req, res, next) => {
    // Log lỗi ra console để Developer dễ debug (có thể ghi vào file log trong thực tế)
    console.error(`[Error] ${err.message}`);

    // Mặc định lỗi hệ thống là 500 (Internal Server Error)
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Đã có lỗi xảy ra từ phía máy chủ.';

    // 1. Xử lý các lỗi phổ biến từ MySQL
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 400; // Bad Request
        message = 'Dữ liệu này đã tồn tại trong hệ thống (Trùng lặp khóa).';
    } 
    else if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        statusCode = 400;
        message = 'Không thể xóa do dữ liệu này đang được liên kết với các mục khác.';
    }

    // 2. Xử lý lỗi Token (JWT)
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401; // Unauthorized
        message = 'Token không hợp lệ. Vui lòng đăng nhập lại.';
    } 
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    }

    // Trả về JSON chuẩn hóa cho Frontend
    res.status(statusCode).json({
        success: false,
        message: message,
        // Chỉ hiển thị stack trace (đường dẫn lỗi chi tiết) khi đang ở môi trường dev
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

// Middleware bắt các route không tồn tại (404 Not Found)
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Không tìm thấy đường dẫn: ${req.originalUrl}`);
    res.status(404);
    next(error); // Chuyển lỗi này tới errorHandler ở trên
};

module.exports = {
    errorHandler,
    notFoundHandler
};