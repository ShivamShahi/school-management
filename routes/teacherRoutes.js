const express = require('express');
const { addTeacher, getTeachers, getTeacherExpenses, deleteTeacher } = require('../controllers/teacherController');

const router = express.Router();

router.post('/', addTeacher);
router.get('/', getTeachers);
router.delete('/:id', deleteTeacher);
router.get('/expenses', getTeacherExpenses);

module.exports = router;

