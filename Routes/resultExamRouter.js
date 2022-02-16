const router = require('express').Router();
const resultExam = require('../Controllers/resultExamControler');
const auth = require('../Middleware/auth')


// router.get('/:id', resultExam.getExamById)
// router.post('/createExam', auth, resultExam.createExam)
// router.delete('/deleteExam/:id', auth, resultExam.deleteExam)
// router.patch('/editExam/:id', auth, resultExam.editExam)
router.post('/', auth, resultExam.createResult)
router.post('/getByExam', auth, resultExam.getByExam)
router.post('/getLastResult', auth, resultExam.getResult)
router.get('/getByIdUser/:id', auth, resultExam.getByIdUser)


module.exports = router;