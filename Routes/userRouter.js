const router = require('express').Router();
const userController = require('../Controllers/userController');
const auth = require('../Middleware/auth');
const authAdmin = require('../Middleware/authAdmin')

router.post('/register', userController.register)

router.post('/createUser', auth, authAdmin, userController.createUserAdmin)

router.post('/activation', userController.activateEmail)

router.post('/login', userController.login)

router.post('/admin/login', userController.loginAdmin)

router.post('/google_login', userController.googleLogin)

router.post('/refresh_token', userController.getAccessToken)

router.post('/forgot', userController.forgotPassword)

router.post('/reset', auth, userController.resetPassword)

router.get('/info', auth, userController.getUserInfo)

router.get('/infoById/:id', auth, userController.getUserById)

router.get('/all_info', userController.getUsersAllInfo)

router.get('/getExamByUser', userController.getExamByUser)

router.get('/countMonth', userController.getCountMonthNow)

router.get('/logout', userController.logout)

router.patch('/update/:id', auth, userController.updateUser)

router.patch('/update_role/:id', auth, authAdmin, userController.updateUserRole)

router.delete('/delete/:id', auth, authAdmin, userController.deleteUser)

module.exports = router;