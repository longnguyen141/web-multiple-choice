const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Vui lòng nhập tên"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Vui lòng nhập email"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Vui lòng nhập password"],
    },
    role: {
        type: Number,
        default: 0// 0= user, 1 = admin
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dtxt7omes/image/upload/v1633249592/Backgound_machgd.webp"
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Users', userSchema)