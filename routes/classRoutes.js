const express = require('express');
const { addClass, getClasses, getClassAnalytics } = require('../controllers/classController');

const router = express.Router();

router.post('/', addClass);
router.get('/', getClasses);
router.get('/:id/analytics', getClassAnalytics);

module.exports = router;

