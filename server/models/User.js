const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  membershipLevel: {
    type: String,
    enum: ['free', 'bronze', 'silver', 'gold', 'grand-bronze', 'grand-silver', 'grand-gold'],
    default: 'free'
  },
  masoliteId: {
    type: String,
    unique: true
  },
  mazolBalance: {
    type: Number,
    default: 0
  },
  miningRate: {
    type: Number,
    default: 0.012
  },
  referralCode: String,
  upline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  walletAddress: String,
  paidRegistration: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate masolite ID before saving
UserSchema.pre('save', function(next) {
  if (!this.masoliteId) {
    const prefix = this.membershipLevel.startsWith('free') ? 'MSL' : 
                 this.membershipLevel.startsWith('bronze') ? 'MSL-B' :
                 this.membershipLevel.startsWith('silver') ? 'MSL-S' : 'MSL-G';
    this.masoliteId = `${prefix}-${Math.floor(100000000 + Math.random() * 900000000)}`;
  }
  next();
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
