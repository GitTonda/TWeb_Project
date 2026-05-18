const express = require('express');
const router = express.Router();
const index_controller = require('../controllers/index_controller');

router.get('/api/test-rating', index_controller.test_ratings);

module.exports = router;