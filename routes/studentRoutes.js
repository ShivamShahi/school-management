const express = require('express');
const { addStudent, getStudents, deleteStudent } = require('../controllers/studentController');

const router = express.Router();

router.post('/', addStudent);
router.get('/', getStudents);
router.delete('/:id', deleteStudent);

module.exports = router;

