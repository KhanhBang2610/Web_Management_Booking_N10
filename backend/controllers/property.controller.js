// Xử lý request lấy danh sách khách sạn, tìm kiếm theo bộ lọc.

const db = require('../config/db.config');

// 1. Lấy danh sách toàn bộ khách sạn (Có phân trang cơ bản)
const getAllProperties = async (req, res) => {
    try {
        // Lấy page và limit từ query (mặc định page 1, 10 items/page)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [properties] = await db.query(
            'SELECT id, name, address, star_rating FROM properties LIMIT ? OFFSET ?',
            [limit, offset]
        );

        // Đếm tổng số lượng để FE làm giao diện phân trang (Pagination)
        const [totalRows] = await db.query('SELECT COUNT(id) as total FROM properties');
        const total = totalRows[0].total;

        res.status(200).json({
            message: 'Lấy danh sách thành công',
            data: properties,
            pagination: {
                totalItems: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            }
        });
    } catch (error) {
        console.error('Lỗi API getAllProperties:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách khách sạn.' });
    }
};

// 2. Tìm kiếm và Lọc khách sạn (Tính năng quan trọng nhất)
const searchProperties = async (req, res) => {
    try {
        const { location_id, min_price, max_price, star_rating, keyword } = req.query;

        // Bắt đầu xây dựng câu lệnh SQL động
        // Dùng 1=1 để dễ dàng nối thêm các điều kiện AND ở phía sau
        let query = `
            SELECT p.id, p.name, p.address, p.star_rating, p.description, l.name as location_name
            FROM properties p
            JOIN locations l ON p.location_id = l.id
            WHERE 1=1
        `;
        const queryParams = [];

        // Lọc theo keyword (tìm tên khách sạn)
        if (keyword) {
            query += ' AND p.name LIKE ?';
            queryParams.push(`%${keyword}%`);
        }

        // Lọc theo khu vực (Vũng Tàu, Quảng Ninh...)
        if (location_id) {
            query += ' AND p.location_id = ?';
            queryParams.push(location_id);
        }

        // Lọc theo số sao
        if (star_rating) {
            query += ' AND p.star_rating = ?';
            queryParams.push(star_rating);
        }

        /* Lọc theo khoảng giá:
           Thường giá sẽ nằm ở bảng rooms (giá thấp nhất của khách sạn đó).
           Đây là một câu Subquery (truy vấn lồng) để tìm các khách sạn có phòng nằm trong tầm giá.
        */
        if (min_price || max_price) {
            query += ` AND p.id IN (
                SELECT property_id FROM rooms WHERE 1=1
            `;
            if (min_price) {
                query += ' AND base_price >= ?';
                queryParams.push(min_price);
            }
            if (max_price) {
                query += ' AND base_price <= ?';
                queryParams.push(max_price);
            }
            query += ')'; // Đóng ngoặc cho subquery
        }

        // Thực thi câu lệnh SQL đã được build
        const [results] = await db.query(query, queryParams);

        res.status(200).json({
            message: 'Tìm kiếm thành công',
            totalResults: results.length,
            data: results
        });
    } catch (error) {
        console.error('Lỗi API searchProperties:', error);
        res.status(500).json({ message: 'Lỗi server khi tìm kiếm khách sạn.' });
    }
};

// 3. Lấy chi tiết 1 khách sạn và danh sách các phòng thuộc khách sạn đó
const getPropertyById = async (req, res) => {
    try {
        const propertyId = req.params.id; // Lấy ID từ URL param (VD: /api/properties/5)

        // Lấy thông tin cơ bản của khách sạn
        const [properties] = await db.query(
            'SELECT * FROM properties WHERE id = ?', 
            [propertyId]
        );

        if (properties.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy khách sạn này.' });
        }

        const propertyDetail = properties[0];

        // Lấy danh sách các phòng thuộc khách sạn này
        const [rooms] = await db.query(
            'SELECT id, room_type, base_price, capacity, total_rooms FROM rooms WHERE property_id = ?',
            [propertyId]
        );

        // Gắn danh sách phòng vào object trả về
        propertyDetail.rooms = rooms;

        res.status(200).json({
            message: 'Lấy thông tin chi tiết thành công',
            data: propertyDetail
        });
    } catch (error) {
        console.error('Lỗi API getPropertyById:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy chi tiết khách sạn.' });
    }
};

module.exports = {
    getAllProperties,
    searchProperties,
    getPropertyById
};