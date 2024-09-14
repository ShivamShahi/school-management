const express = require('express');
const { addClass, getClasses, getClassAnalytics, deleteClass } = require('../controllers/classController');

const router = express.Router();

router.post('/', addClass);
router.get('/', getClasses);
router.delete('/:id', deleteClass);
router.get('/:id/analytics', getClassAnalytics);

module.exports = router;

