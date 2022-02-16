const jwt = require('jsonwebtoken');
const Tags = require('../Models/tagsModel');
const Exams = require('../Models/examModel');

const tagsController = {
    createCategory: async (req, res) => {
        try {

            const ptm = await Tags.find({ displayName: req.body.displayName }).select();
            if (ptm.length > 0) {
                return res.status(400).json({ msg: "Tên lĩnh vựa đã tồn tại" })
            }
            const check = fnCheckValueExist(req.body.childrents);
            if (check) {
                return res.status(400).json({ msg: "Đã có ít nhất 2 thẻ trùng tên vui lòng kiểm tra lại" })
            }

            const newTags = new Tags({ ...req.body, idUser: req.user.id })
            await newTags.save()
            res.json({ msg: 'Tạo thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    createTags: async (req, res) => {
        try {
            await Tags.findOneAndUpdate({ _id: req.params.id }, {
                ...req.body
            })
            res.json({ msg: 'Cập thông tin thẻ thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    getAllCategory: async (req, res) => {
        try {
            const tagsList = await Tags.find().select();
            res.json(tagsList)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    editTags: async (req, res) => {
        try {
            await Tags.findOneAndUpdate({ _id: req.body._id }, {
                ...req.body
            })
            res.json({ msg: 'Cập thông tin thẻ thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getCount: async (req, res) => {
        try {
            const tagsList = await Tags.find().select();
            const examList = await Exams.find().select();
            const result = [];
            tagsList.map(item => {
                const arr = [item.displayName];
                let p = 0;
                examList.map(value => {
                    if (value.field === item._id.toString()) {
                        p++;
                    }
                })
                arr.push(p)
                result.push(arr);
            })
            res.json(result)
        } catch (error) {
            return res.status(500).json({ msg: error.message });

        }
    },
    getCountMonthNow: async (req, res) => {
        try {
            const tagsList = await Tags.find().select();
            let p = 0;
            tagsList.map(item => {
                if (new Date(item.createdAt).getMonth() === new Date().getMonth()) p++;
            });
            res.json(p)
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    // editTags: async (req, res) => {
    //     try {
    //         await Tags.findOneAndUpdate({ _id: req.body._id }, {
    //             ...req.body
    //         })
    //         res.json({ msg: 'Cập thông tin thẻ thành công!' })
    //     } catch (error) {
    //         return res.status(500).json({ msg: error.message });
    //     }
    // },

    deleteCategory: async (req, res) => {
        try {

            await Tags.findOneAndDelete({ _id: req.params.id })
            res.json({ msg: 'Xóa Lĩnh vực thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    deleteTags: async (req, res) => {
        try {
            await Tags.findOneAndUpdate({ _id: req.params.id }, {
                ...req.body
            })
            res.json({ msg: 'Xóa thẻ thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },


    getCategoryById: async (req, res) => {
        try {
            const data = await Tags.findById(req.params.id);
            res.json(data)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
}

module.exports = tagsController

const fnCheckValueExist = (arr) => {
    for (let value of arr) {
        const check = arr.filter(item => item.nameCategory === value.nameCategory)
        if (check.length > 1) {
            return true;
        }
    }
    return false;
}
