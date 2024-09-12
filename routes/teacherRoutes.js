const express = require('express');
const { addTeacher, getTeachers, getTeacherExpenses } = require('../controllers/teacherController');

const router = express.Router();

router.post('/', addTeacher);
router.get('/', getTeachers);
router.get('/expenses', getTeacherExpenses);

module.exports = router;

