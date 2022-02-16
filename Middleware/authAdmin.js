const Users = require('../Models/userModel');

const authAdmin = async (req, res, next) => {
    try {
        const user = await Users.findOne({ _id: req.user.id })
        if (user.role !== 1) return res.status(400).json({ msg: "Tài khoản không có quyển truy cập vui lòng kiểm tra lại" });
        next();
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

module.exports = authAdmin