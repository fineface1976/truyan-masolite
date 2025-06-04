 const LiveSession = require('../models/LiveSession');
const fs = require('fs');
const path = require('path');

exports.saveRecording = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const recording = req.file; // Multer middleware handles upload

    const liveSession = await LiveSession.findById(sessionId);
    if (!liveSession) {
      return res.status(404).json({ error: 'Live session not found' });
    }

    // Save recording path to DB
    liveSession.recordingPath = recording.path;
    await liveSession.save();

    res.json({ message: 'Recording saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add to your existing exports
module.exports = {
  startLiveSession,
  sendTip,
  saveRecording  // Add this line
};
