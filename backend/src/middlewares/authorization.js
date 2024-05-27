const jwt = require('jsonwebtoken');

function checkAdminRole(req, res, next) {
    const token = req.header('Authorization') || req.query.token;

    if (!token) {
        console.log('Vui lòng cung cấp token')
        return res.status(401).json({ message: 'Vui lòng cung cấp token' });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin người dùng được giải mã từ token
        next(); // Cho phép tiếp tục xử lý yêu cầu
    } catch (error) {
        console.log('Token khong hop le')
        // Nếu có lỗi trong quá trình giải mã hoặc token không hợp lệ
        return res.status(401).json({ message: 'Token không hợp lệ' });

    }
}

module.exports = {
    checkAdminRole,
};
