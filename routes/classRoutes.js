const express = require('express');
const { addClass, getClasses, getClassAnalytics, deleteClass, getAllClassAnalytics } = require('../controllers/classController');

const router = express.Router();

router.post('/', addClass);
router.get('/', getClasses);
router.delete('/:id', deleteClass);
router.get('/:id/analytics', getClassAnalytics);
router.get('/analytics', getAllClassAnalytics);

module.exports = router;

