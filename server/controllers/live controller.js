const LiveSession = require('../models/LiveSession');
const User = require('../models/User');

exports.startLiveSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    // Check follower count
    const followerCount = await User.countDocuments({ following: userId });
    if (followerCount < 500) {
      return res.status(403).json({ 
        error: 'You need at least 500 followers to start a live session' 
      });
    }

    const liveSession = new LiveSession({
      host: userId,
      title: req.body.title,
      description: req.body.description
    });

    await liveSession.save();
    res.status(201).json(liveSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.sendTip = async (req, res) => {
  try {
    const { sessionId, amount, message } = req.body;
    const senderId = req.user.id;

    // Verify sender has enough MZLx
    const sender = await User.findById(senderId);
    if (sender.mazolBalance < amount) {
      return res.status(400).json({ error: 'Insufficient MZLx balance' });
    }

    // Update balances
    sender.mazolBalance -= amount;
    await sender.save();

    const host = await User.findOne({ _id: req.liveSession.host });
    host.mazolBalance += amount;
    await host.save();

    // Record tip
    const liveSession = await LiveSession.findByIdAndUpdate(
      sessionId,
      {
        $push: {
          tipsReceived: {
            from: senderId,
            amount,
            message
          }
        },
        $inc: { totalTips: amount }
      },
      { new: true }
    );

    res.json(liveSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
