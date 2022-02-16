const cloudinary = require('cloudinary').v2
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_SECRET
})
// cloudinary.config({
//     cloud_name: process.env.CLOUNDINARY_NAME,
//     api_key: process.env.CLOUNDINARY_API_KEY,
//     api_secret: process.env.CLOUNDINARY_SECRET,
// })
// app.post("/upload", function (req, res, next) {
//     const file = req.files.file;
//     cloudinary.uploader.upload(file.tempFilePath, function (err, result) {
//         res.send({
//             success: true,
//             result,
//         })
//     })
// })


const uploadCtrl = {
    uploadAvatar: (req, res) => {
        try {
            const file = req.files.file;
            cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'avatar', width: 250, height: 250, crop: "fill"
            }, (err, result) => {
                removeTmp(file.tempFilePath)
                res.json({ url: result.secure_url })
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message, error: "error" })
        }
    }

}


const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}

module.exports = uploadCtrl