const router = require('express').Router();
const examController = require('../Controllers/examController');
const auth = require('../Middleware/auth')
const express = require('express')


router.get('/countMonth', examController.getCountMonthNow)
router.post('/createExam', auth, examController.createExam)
router.delete('/deleteExam/:id', auth, examController.deleteExam)
router.patch('/editExam/:id', auth, examController.editExam)
router.get('/:id', examController.getExamById)
router.get('/', examController.getAllExam)

module.exports = router;