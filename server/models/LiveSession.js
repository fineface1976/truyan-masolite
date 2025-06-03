const mongoose = require('mongoose');

const LiveSessionSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  streamKey: {
    type: String,
    unique: true,
    required: true
  },
  viewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxViewers: {
    type: Number,
    default: 0
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  tipsReceived: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  totalTips: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Add pre-save hook to generate stream key
LiveSessionSchema.pre('save', function(next) {
  if (!this.streamKey) {
    this.streamKey = `live_${this.host}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

module.exports = mongoose.model('LiveSession', LiveSessionSchema);
