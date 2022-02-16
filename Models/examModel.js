const mongoose = require('mongoose');
const auth = require('../Middleware/auth');

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Vui lòng nhập tiêu đề"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Vui lòng nhập mô tả"],
        trim: true,
    },
    testTime: {
        type: Number,
        required: [true, "Vui lòng nhập thời gian kiểm tra"],
    },
    field: {
        type: String,
        required: [true, "Vui lòng chọn lĩnh vực"]
    },
    tags: {
        type: [String],
        default: [],
        required: [true, "Vui lòng chọn ít nhất một chủ thẻ"],
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dtxt7omes/image/upload/v1633249592/Backgound_machgd.webp"
    },
    idUser: {
        type: String,
        required: [true]
    },
    authorName: {
        type: String,
        required: [true]
    },
    status: {
        type: String,
        required: [true]
    },
    listQuestion: [{
        question: {
            type: String,
            required: [true, "Vui lòng nhập lại thông tin"],
        },
        answer1: {
            type: String,
            required: [true, "Vui lòng nhập lại thông tin"],
        },
        answer2: {
            type: String,
            required: [true, "Vui lòng nhập lại thông tin"],
        },
        answer3: {
            type: String,
            required: [true, "Vui lòng nhập lại thông tin"],
        },
        answer4: {
            type: String,
            required: [true, "Vui lòng nhập lại thông tin"],
        },
        correct: {
            type: String,
            required: [true, "Vui lòng nhập lại thông tin"],
        },
        explain: String,
    }]
}, {
    timestamps: true
})
module.exports = mongoose.model('Exams', examSchema)