const jwt = require('jsonwebtoken');
const Exams = require('../Models/examModel');

const examController = {
    createExam: async (req, res) => {
        try {
            const ptm = await Exams.find({ title: req.body.title }).select();
            if (ptm.length > 0) {
                return res.status(400).json({ msg: "Tiêu đề bộ đề đã tồn tại" })
            }
            const newExam = new Exams({ ...req.body, idUser: req.user.id })
            await newExam.save()
            res.json({ msg: 'Tạo bộ đề thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getCountMonthNow: async (req, res) => {
        try {
            const examList = await Exams.find().select();
            let p = 0;
            examList.map(item => {
                if (new Date(item.createdAt).getMonth() === new Date().getMonth()) p++;
            });
            res.json(p)
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    editExam: async (req, res) => {
        try {
            await Exams.findOneAndUpdate({ _id: req.params.id }, {
                ...req.body
            })
            res.json({ msg: 'Cập nhật bộ đề thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    deleteExam: async (req, res) => {
        try {
            await Exams.findOneAndDelete({ _id: req.params.id })
            res.json({ msg: 'Xóa bộ đề thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getAllExam: async (req, res) => {
        try {
            const exams = await Exams.find().select();
            res.json(exams)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getExamById: async (req, res) => {
        try {
            const data = await Exams.findById(req.params.id);
            res.json(data)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
}

module.exports = examController
