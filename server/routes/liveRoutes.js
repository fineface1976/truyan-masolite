const express = require('express');
const router = express.Router();
const liveController = require('../controllers/liveController');
const auth = require('../middleware/auth');

// Start a live session
router.post('/start', auth, liveController.startLiveSession);

// End a live session
router.post('/:id/end', auth, liveController.endLiveSession);

// Get active live sessions
router.get('/active', liveController.getActiveSessions);

// Join a live session
router.get('/:id/join', auth, liveController.joinLiveSession);

// Send tip during live
router.post('/:id/tip', auth, liveController.sendTip);

module.exports = router;
