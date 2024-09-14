const express = require('express');
const { addStudent, getStudents, deleteStudent, getStudentExpenses } = require('../controllers/studentController');

const router = express.Router();

router.post('/', addStudent);
router.get('/', getStudents);
router.delete('/:id', deleteStudent);
router.get('/expenses', getStudentExpenses);

module.exports = router;

