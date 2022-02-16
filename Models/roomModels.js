const mongoose = require('mongoose');
const auth = require('../Middleware/auth');

const roomSchema = new mongoose.Schema({
    nameRoom: {
        type: String,
        required: [true, "Vui lòng nhập tiêu đề"],
        trim: true
    },
    testTimeRoom: {
        type: Number,
        required: [true, "Vui lòng nhập thời gian kiểm tra"],
    },
    idUser: {
        type: String
    },
    authorName: {
        type: String
    },
    enable: {
        type: Boolean,
        default: false,
    },
    activeTime: {
        type: Date,
    },
    listUser: [
        {
            emailItemUser: String,
            point: {
                type: Number,
                default: 0,
            },
            timeFinish: {
                type: Number,
                default: 0,
            }
        }
    ],
    infoExamRoom: {
        title: {
            type: String,
            // required: [true, "Vui lòng nhập tiêu đề"],
            trim: true
        },
        description: {
            type: String,
            // required: [true, "Vui lòng nhập mô tả"],
            trim: true,
        },
        testTime: {
            type: Number,
            // required: [true, "Vui lòng nhập thời gian kiểm tra"],
        },
        field: {
            type: String,
            // required: [true, "Vui lòng chọn lĩnh vực"]
        },
        tags: {
            type: [String],
            default: [],
            // required: [true, "Vui lòng chọn ít nhất một chủ thẻ"],
        },
        avatar: {
            type: String,
            default: "https://res.cloudinary.com/dtxt7omes/image/upload/v1633249592/Backgound_machgd.webp"
        },
        idUser: {
            type: String
        },
        authorName: {
            type: String
        },
        status: {
            type: String,
        },
        listQuestion: [{
            question: String,
            answer1: String,
            answer2: String,
            answer3: String,
            answer4: String,
            correct: String,
            explain: String,
        }]
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Rooms', roomSchema)