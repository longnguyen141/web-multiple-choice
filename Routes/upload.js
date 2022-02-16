const router = require('express').Router();
const uploadImage = require('../Middleware/uploadImage');
const uploadController = require('../Controllers/uploadController');
const auth = require('../Middleware/auth');


router.post('/upload__avatar', uploadImage, auth, uploadController.uploadAvatar);

module.exports = router