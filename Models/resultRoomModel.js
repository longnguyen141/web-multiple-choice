const mongoose = require('mongoose');

const resultRoomSchema = new mongoose.Schema({
    idRoom: {
        type: String,
        trim: true
    },
    idUser: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    enable: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        trim: true,
        default: "hoàn thành"
    },
    userName: {
        type: String,
        trim: true,
    },
    nameRoom: {
        type: String,
        trim: true,
    },
    point: {
        type: Number,
    },
    quantityQuestion: {
        type: Number,
    },
    timeTest: {
        type: Number,
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
module.exports = mongoose.model('ResultRoom', resultRoomSchema)