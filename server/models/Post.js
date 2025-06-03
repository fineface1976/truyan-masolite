const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    maxlength: 2000
  },
  media: [{
    url: String,
    mediaType: {
      type: String,
      enum: ['image', 'video', 'audio']
    }
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  shares: {
    type: Number,
    default: 0
  },
  engagementScore: {
    type: Number,
    default: 0
  },
  isLive: {
    type: Boolean,
    default: false
  },
  liveSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LiveSession'
  }
}, { timestamps: true });

// Update engagement score before save
PostSchema.pre('save', function(next) {
  this.engagementScore = this.likes.length * 2 + this.comments.length * 3 + this.shares * 5;
  next();
});

module.exports = mongoose.model('Post', PostSchema);
