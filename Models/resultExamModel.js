const mongoose = require('mongoose');

const resultExamSchema = new mongoose.Schema({
    idExam: {
        type: String,
        required: [true, "Mã bộ đề đã trống vui lòng kiểm tra lại"],
        trim: true
    },
    idUser: {
        type: String,
        required: [true, "Mã người dùng đã trống vui lòng kiểm tra lại"],
        trim: true
    },
    userName: {
        type: String,
        trim: true,
    },
    titleExam: {
        type: String,
        trim: true,
    },
    point: {
        type: Number,
        required: true,
    },
    quantityQuestion: {
        type: Number,
        required: true,
    },
    timeTest: {
        type: Number,
        required: true,
    },
    listQuestion: [{
        question: String,
        answer1: String,
        answer2: String,
        answer3: String,
        answer4: String,
        correct: String,
        explain: String,
        choose: String,
    }]

}, {
    timestamps: true
})
module.exports = mongoose.model('ResultExam', resultExamSchema)