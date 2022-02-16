require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2;
const path = require('path')
const app = express();

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use(fileUpload({
    useTempFiles: true
}))

// app.use('/', (req, res, next) => {
//     res.json({ msg: "hello wold" })
// })

//Routes
app.use('/user', require('./Routes/userRouter'))
app.use('/exam', require('./Routes/examRouter'))
app.use('/tags', require('./Routes/tagsRouter'))
app.use('/rooms', require('./Routes/roomRouter'))
app.use('/resultExam', require('./Routes/resultExamRouter'))
app.use('/resultRoom', require('./Routes/resultRoomRouter'))
app.use('/api', require('./Routes/upload'))
app.use('/downloadHD', (req, res) => {
    res.download('./HuongDan.zip');
})

//Connect mongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, err => {
    if (err) throw err;
    console.log('connected to mongodb ')
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('Client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'Client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('server is running on port', PORT)
})