const router = require('express').Router();
const roomsController = require('../Controllers/roomControler');
const auth = require('../Middleware/auth');
const authAdmin = require('../Middleware/authAdmin');

router.post('/create', auth, roomsController.createRoom)
router.patch('/addUserJoin/:id', auth, roomsController.addUserJoin)
router.get('/getRoomCreateByUser/:id', auth, roomsController.getRoomCreateByUser)
router.get('/getRoomByUserJoin/:email', auth, roomsController.getRoomByUserJoin)
router.get('/infoRoom/:id', auth, roomsController.getRoomById)
router.patch('/update-room/:id', auth, roomsController.updateRoom)
router.delete('/delete-room/:id', auth, roomsController.deleteRoom)
router.get('/getListUserInvite/:id', auth, roomsController.getListUserInvite)
router.get('/countMonth', roomsController.getCountMonthNow)
router.get('/', roomsController.getAllRoom)


module.exports = router;