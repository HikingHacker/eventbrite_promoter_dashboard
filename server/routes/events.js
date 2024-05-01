const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController.js');

router.get('/api/events', eventsController.getEvents);

module.exports = router;