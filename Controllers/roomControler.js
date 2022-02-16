const jwt = require('jsonwebtoken');
const Rooms = require('../Models/roomModels');

const roomController = {
    createRoom: async (req, res) => {
        try {
            const { listUser } = req.body;
            const ptm = await Rooms.find({ nameRoom: req.body.nameRoom }).select();
            if (ptm.length > 0) {
                return res.status(400).json({ msg: "Tên phòng thi đã tồn tại" })
            }
            const newArr = []
            listUser.forEach((user) => {
                item = {
                    emailItemUser: user,
                    point: 0,
                    timeFinish: 0,
                }
                newArr.push(item);
            })
            const newValue = { ...req.body, listUser: newArr, idUser: req.user.id }
            const newRoom = new Rooms(newValue)
            await newRoom.save()
            res.json({ msg: 'Tạo phòng thi thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    addUserJoin: async (req, res) => {
        try {
            const { listUser } = req.body;
            const newArr = []
            listUser.forEach((user) => {
                item = {
                    emailItemUser: user,
                    point: 0,
                    timeFinish: 0,
                }
                newArr.push(item);
            })

            await Rooms.findOneAndUpdate({ _id: req.params.id }, {
                ...req.body
            })
            res.json({ msg: 'Cập nhật phòng thi thành công!' })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    getAllRoom: async (req, res) => {
        try {
            const rooms = await Rooms.find().select();
            res.json(rooms)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    getCountMonthNow: async (req, res) => {
        try {
            const roomList = await Rooms.find().select();
            let p = 0;
            roomList.map(item => {
                if (new Date(item.createdAt).getMonth() === new Date().getMonth()) p++;
            });
            res.json(p)
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getRoomById: async (req, res) => {
        try {
            const rooms = await Rooms.findOne({ _id: req.params.id }).select();
            res.json(rooms)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getRoomCreateByUser: async (req, res) => {
        try {
            const rooms = await Rooms.find({ idUser: req.params.id }).select();
            res.json(rooms);
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getRoomCreateByUser: async (req, res) => {
        try {
            const rooms = await Rooms.find({ idUser: req.params.id }).select();
            res.json(rooms);
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getRoomByUserJoin: async (req, res) => {
        try {
            const rooms = await Rooms.find().select();
            const fn = (value) => {
                return value.emailItemUser === req.params.email;
            }
            const functionF = (test) => {
                return test.filter(item => item.listUser.some(fn))
            }
            const finalValue = functionF(rooms);
            res.json(finalValue)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    updateRoom: async (req, res) => {
        try {
            const { listUser } = req.body;
            const newArr = []
            listUser.forEach((user) => {
                item = {
                    emailItemUser: user,
                    point: 0,
                    timeFinish: 0,
                }
                newArr.push(item);
            })
            const newValue = { ...req.body, listUser: newArr }
            await Rooms.findOneAndUpdate({ _id: req.params.id }, {
                ...newValue
            })
            res.json({ msg: 'Cập nhật phòng thi thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getListUserInvite: async (req, res) => {
        try {
            const rooms = await Rooms.findOne({ _id: req.params.id }).select();
            const final = [];
            rooms.listUser.map(item => final.push(item.emailItemUser))
            res.json(final)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    deleteRoom: async (req, res) => {
        try {
            await Rooms.findOneAndDelete({ _id: req.params.id })
            res.json({ msg: 'Xóa phòng thi thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

}

module.exports = roomController