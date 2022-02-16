const Users = require('../Models/userModel');
const Exams = require('../Models/examModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis')
const { OAuth2 } = google.auth;
const sendMail = require('./sendMail')
const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const { CLIENT_URL } = process.env

const userController = {
    createUserAdmin: async (req, res) => {
        try {
            const { name, email, password, avatar, role } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ msg: "Vui lòng điền đầy đủ thông tin" })
            }
            if (!validateEmail(email)) {
                return res.status(400).json({ msg: "Vui lòng kiểm tra lại phần email" })
            }
            const user = await Users.findOne({ email });

            if (user) return res.status(400).json({ msg: "Email đã tồn tại" })
            if (password.length < 6) return res.status(400).json({ msg: "Password tối thiểu phải 6 ký tự" })
            const hashPassword = await bcrypt.hash(password, 12);

            const newUser = new Users({
                name, email, password: hashPassword, avatar, role
            })

            await newUser.save();

            // const activation_token = createActivationToken(newUser)

            // const url = `${CLIENT_URL}/user/activate/${activation_token}`
            // sendMail(email, url, "Xác minh email");

            res.json({ msg: 'Tạo tài khoản người dùng thành công!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ msg: "Vui lòng điền đầy đủ thông tin" })
            }
            if (!validateEmail(email)) {
                return res.status(400).json({ msg: "Vui lòng kiểm tra lại phần email" })
            }
            const user = await Users.findOne({ email });
            if (user) return res.status(400).json({ msg: "Email đã tồn tại" })
            if (password.length < 6) return res.status(400).json({ msg: "Password tối thiểu phải 6 ký tự" })

            const hashPassword = await bcrypt.hash(password, 12);

            const newUser = {
                name, email, password: hashPassword
            }
            const activation_token = createActivationToken(newUser)

            const url = `${CLIENT_URL}/user/activate/${activation_token}`

            sendMail(email, url, "Xác minh email");
            res.json({ msg: 'Đăng ký tài khoản thành công! Vui lòng xác nhận tại email của bạn để kích hoạt' })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    activateEmail: async (req, res) => {
        try {
            const { activation_token } = req.body;
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET);

            const { name, email, password } = user;

            const check = await Users.findOne({ email });
            if (check) return res.status(400).json({ msg: "Email đã tồn tại" })

            const newUser = new Users({
                name, email, password
            })

            await newUser.save();
            res.json({
                msg: "Tài khoản đã được kích hoạt"
            })


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email });
            if (!user) return res.status(400).json({ msg: "Email không tồn tại vui lòng kiểm tra lại" })

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Sai mật khẩu vui lòng kiểm tra lại" })

            const refresh_token = createRefreshToken({ id: user._id })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            res.status(200).json({ msg: "Đăng nhập thành công" })
        } catch (error) {
            return res.status(500).json({
                msg: error.message
            })
        }
    },
    loginAdmin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email: email, role: 1 });
            if (!user) return res.status(400).json({ msg: "Email không tồn tại vui lòng kiểm tra lại" })

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Sai mật khẩu vui lòng kiểm tra lại" })

            const refresh_token = createRefreshToken({ id: user._id })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            res.status(200).json({ msg: "Đăng nhập thành công" })
        } catch (error) {
            return res.status(500).json({
                msg: error.message
            })
        }
    },
    getAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Vui lòng đăng nhập" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Vui lòng đăng nhập" })
                const access_token = createAccessToken({ id: user.id });
                res.json({ access_token })
            });

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await Users.findOne({ email });
            if (!user) return res.status(400).json({ msg: "Email không tồn tại" })
            const access_token = createAccessToken({ id: user._id });

            const url = `${CLIENT_URL}/user/reset/${access_token}`;
            sendMail(email, url, "Vui lòng xác nhận đặt lại mật khẩu");
            res.json({ msg: "Đã gửi lại mật khẩu, vui lòng kiểm tra mail" })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { password } = req.body;

            const passwordHash = await bcrypt.hash(password, 12);

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                password: passwordHash
            })

            res.json({ msg: 'Đặt lại thành công' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getUserInfo: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select();
            res.json(user)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getUsersAllInfo: async (req, res) => {
        try {
            const users = await Users.find().select();
            res.json(users);
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
            return res.json({ mgs: 'Đăng xuất thành công' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getUserById: async (req, res) => {
        try {
            const user = await Users.findOne({ _id: req.params.id }).select();
            res.json(user)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    updateUser: async (req, res) => {
        try {

            const { name, password, avatar, role } = req.body;
            if (!name || !password) {
                return res.status(400).json({ msg: "Vui lòng điền đầy đủ thông tin" })
            }

            if (password.length < 6) return res.status(400).json({ msg: "Password tối thiểu phải 6 ký tự" })
            const dataUserCurrent = await Users.findById(req.params.id);
            if (dataUserCurrent.password === password) {
                //     if (role === '' || role === undefined) {
                //         await Users.findOneAndUpdate({ _id: req.params.id }, {
                //             name, avatar
                //         })
                //     } else {
                //         await Users.findOneAndUpdate({ _id: req.params.id }, {
                //             name, avatar, role
                //         })
                //     }
                // } else {

                const hashPassword = await bcrypt.hash(password, 12);
                if (role === '' || role === undefined) {
                    await Users.findOneAndUpdate({ _id: req.params.id }, {
                        name, password: hashPassword, avatar
                    })
                } else {
                    if (password.length > 20) return res.status(400).json({ msg: "Password quá dài ký tự" })
                    await Users.findOneAndUpdate({ _id: req.params.id }, {
                        name, password: hashPassword, avatar, role
                    })
                }
            } else {
                const hashPassword = await bcrypt.hash(password, 12);
                if (role === '' || role === undefined) {
                    await Users.findOneAndUpdate({ _id: req.params.id }, {
                        name, password: hashPassword, avatar
                    })
                } else {
                    if (password.length > 20) return res.status(400).json({ msg: "Password quá dài ký tự" })
                    await Users.findOneAndUpdate({ _id: req.params.id }, {
                        name, password: hashPassword, avatar, role
                    })
                }
            }
            res.json({ msg: "Cập nhật thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    updateUserRole: async (req, res) => {
        try {
            const { role } = req.body;
            await Users.findOneAndUpdate({ _id: req.params.id }, {
                role
            })
            res.json({ msg: "Cập nhật thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getCountMonthNow: async (req, res) => {
        try {
            const userList = await Users.find().select();
            let p = 0;
            userList.map(item => {
                if (new Date(item.createdAt).getMonth() === new Date().getMonth()) p++;
            });
            res.json(p)
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    getExamByUser: async (req, res) => {
        try {
            const exams = await Exams.find().select();
            const users = await Users.find().select();
            const list = [];
            let final = { user: users };

            await users.map(item => {
                const listResult = exams.filter(value => value.idUser === item._id.toString())
                list.push(listResult.length);
            })
            final = { ...final, listLength: list }
            res.json(final)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    deleteUser: async (req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id);
            res.json({
                msg: "xoá tài khoản thành công"
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    googleLogin: async (req, res) => {
        try {
            const { tokenId } = req.body;

            const verify = await client.verifyIdToken({ idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID })
            const { email_verified, name, picture, email } = verify.payload
            const password = email + process.env.GOOGLE_SECRET;
            const hashPassword = await bcrypt.hash(password, 12);
            if (!email_verified) return res.status(400).json({ msg: "Xác minh email thất bại vui lòng kiểm tra lại" })

            if (email_verified) {
                const user = await Users.findOne({ email });
                if (user) {
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (!isMatch) return res.status(400).json({ msg: "Tài khoản đã được đăng ký theo hình thức email password, vui lòng kiểm tra lại" })
                    const refresh_token = createRefreshToken({ id: user._id })
                    res.cookie('refreshtoken', refresh_token, {
                        httpOnly: true,
                        path: '/user/refresh_token',
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    })
                    return res.status(200).json({ msg: "Đăng nhập thành công" })
                } else {
                    const newUser = new Users({
                        name, password: hashPassword, email, avatar: picture
                    })
                    await newUser.save();
                    const refresh_token = createRefreshToken({ id: newUser._id })
                    res.cookie('refreshtoken', refresh_token, {
                        httpOnly: true,
                        path: '/user/refresh_token',
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    })
                    return res.status(200).json({ msg: "Đăng nhập thành công" })
                }
            }

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5h' })
}
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' })
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
module.exports = userController;