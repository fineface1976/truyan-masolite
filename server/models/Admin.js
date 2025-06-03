const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['super', 'financial', 'moderator', 'support'],
    default: 'support'
  },
  permissions: {
    userManagement: Boolean,
    financialControls: Boolean,
    contentModeration: Boolean,
    systemConfig: Boolean
  },
  lastLogin: Date
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
