const jwt = require('jsonwebtoken');
const ResultExam = require('../Models/resultExamModel');

const resultExamControler = {
    createResult: async (req, res) => {
        try {
            const result = new ResultExam(req.body)
            await result.save()
            res.json({ msg: 'Tạo result thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getResult: async (req, res) => {
        try {
            const data = await ResultExam.findOne({ idUser: req.body.idUser, idExam: req.body.idExam }).sort({ _id: -1 });
            res.json(data)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getByExam: async (req, res) => {
        try {
            const data = await ResultExam.find({ idExam: req.body.idExam }).sort({ _id: -1 });
            res.json(data)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    getByIdUser: async (req, res) => {
        try {
            const data = await ResultExam.find({ idUser: req.params.id }).sort({ _id: -1 });
            res.json(data)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
}

module.exports = resultExamControler
