const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: [true, "Vui lòng nhập tên lĩnh vực"],
        trim: true
    },
    status: {
        type: String,
        required: [true, "Vui lòng chọn trạng thái"]
    },
    idUser: {
        type: String,
        required: [true]
    },
    authorName: {
        type: String,
    },
    key: {
        type: String,
        required: [true]
    },
    childrents: [{
        nameCategory: {
            type: String,
            required: [true, "Vui lòng nhập tên của childrent"],
            trim: true
        },
        statusCategory: String,
        types: String,
        key: String,
    }]

}, {
    timestamps: true
})
module.exports = mongoose.model('Tags', tagSchema)