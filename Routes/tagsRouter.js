const router = require('express').Router();
const tagsController = require('../Controllers/tagController');
const auth = require('../Middleware/auth');
const authAdmin = require('../Middleware/authAdmin');

router.get('/getCategory/:id', auth, tagsController.getCategoryById)
router.post('/createTags/:id', auth, tagsController.createTags)
router.post('/create', auth, tagsController.createCategory)
router.post('/editTags', auth, tagsController.editTags)
router.delete('/deleteCategory/:id', auth, tagsController.deleteCategory)
router.post('/deleteTags/:id', auth, tagsController.deleteTags)
router.get('/count', tagsController.getCount)
router.get('/countMonth', tagsController.getCountMonthNow)
router.get('/', tagsController.getAllCategory)

module.exports = router;