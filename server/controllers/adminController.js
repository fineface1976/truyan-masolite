 const User = require('../models/User');
const Admin = require('../models/Admin');
const AdminLog = require('../models/AdminLog');

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: 'i' } },
        { masoliteId: { $regex: query, $options: 'i' } }
      ]
    }).select('-password');
    
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    
    // Log admin action
    await AdminLog.create({
      adminId: req.admin.id,
      action: `Updated user status`,
      entityType: 'User',
      entityId: req.params.id,
      metadata: { status }
    });
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.changeMembership = async (req, res) => {
  try {
    const { newLevel } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { membershipLevel: newLevel },
      { new: true }
    ).select('-password');
    
    // Recalculate mining rate
    user.miningRate = calculateMiningRate(user);
    await user.save();
    
    await AdminLog.create({
      adminId: req.admin.id,
      action: `Changed membership level`,
      entityType: 'User',
      entityId: req.params.id,
      metadata: { newLevel }
    });
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

function calculateMiningRate(user) {
  const baseRate = 0.012;
  let multiplier = 1;
  
  if (user.membershipLevel.includes('bronze')) multiplier = 1.1;
  if (user.membershipLevel.includes('silver')) multiplier = 1.25;
  if (user.membershipLevel.includes('gold')) multiplier = 1.5;
  if (user.membershipLevel.includes('grand')) multiplier += 0.2;
  
  return baseRate * multiplier;
}
