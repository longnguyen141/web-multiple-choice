const jwt = require('jsonwebtoken');
const ResultRoom = require('../Models/resultRoomModel');
const Rooms = require('../Models/roomModels');

const resultRoomControler = {
    createResult: async (req, res) => {
        try {
            const result = new ResultRoom(req.body)
            await result.save()
            res.json({ msg: 'Tạo result thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getAllResult: async (req, res) => {
        try {
            const result = ResultRoom.find().select();
            res.json(result);
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getResult: async (req, res) => {
        try {
            const data = await ResultRoom.findOne({ idUser: req.body.idUser, idRoom: req.body.idRoom }).sort({ _id: -1 });
            res.json(data)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getByIdUser: async (req, res) => {
        try {
            const data = await ResultRoom.find({ idUser: req.params.id }).sort({ _id: -1 });
            res.json(data)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getByIdRoom: async (req, res) => {
        try {
            const data = await ResultRoom.find({ idRoom: req.params.id }).sort({ _id: -1 });
            res.json(data)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    updateEnableResultRoom: async (req, res) => {
        try {
            const { type, idRoom, idUser } = req.body;
            const infoRoom = await Rooms.findOne({ _id: idRoom });
            const newInfoRoom = { ...infoRoom._doc, enable: type };
            await Rooms.findOneAndUpdate({ _id: idRoom }, {
                ...newInfoRoom,
            })
            const listRoom = await ResultRoom.find({ idRoom: idRoom, idUser: idUser });
            listRoom.map(item => {
                const newValue = { ...item._doc, enable: type }
                const UpdateData = async () => {
                    await ResultRoom.findOneAndUpdate({ _id: item._id }, {
                        ...newValue
                    })

                }
                UpdateData();
            })
            if (type === true) {
                await res.json({ msg: 'Trả điểm thành công!' })
            } else {
                await res.json({ msg: 'Thu hồi điểm thành công!' })
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }

}

module.exports = resultRoomControler
