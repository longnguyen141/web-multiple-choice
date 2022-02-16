const router = require('express').Router();
const resultRoom = require('../Controllers/resultRoomController');
const auth = require('../Middleware/auth')


// router.get('/:id', resultRoom.getExamById)
// router.post('/createExam', auth, resultRoom.createExam)
// router.delete('/deleteExam/:id', auth, resultRoom.deleteExam)
// router.patch('/editExam/:id', auth, resultRoom.editExam)
router.post('/', auth, resultRoom.createResult)
router.post('/getResult', auth, resultRoom.getResult)
router.get('/getByIdUser/:id', auth, resultRoom.getByIdUser)
router.get('/getByIdRoom/:id', auth, resultRoom.getByIdRoom)
router.post('/update-enable', auth, resultRoom.updateEnableResultRoom)


module.exports = router;