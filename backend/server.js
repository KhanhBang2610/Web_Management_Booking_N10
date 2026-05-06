// File gốc khởi chạy server Express, gộp các routes.

const express = require('express');
const app = express();
require('dotenv').config();

// Import các middleware và routes
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
// ... các routes khác

app.use(express.json());

// 1. Khai báo các Routes API
app.use('/api/auth', authRoutes);
// app.use('/api/properties', propertyRoutes);
// app.use('/api/bookings', bookingRoutes);

// 2. Xử lý lỗi 404 (Khi client gọi sai endpoint)
app.use(notFoundHandler);

// 3. Xử lý lỗi tổng (Phải nằm cuối cùng)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});