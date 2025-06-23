const mongoose = require('mongoose');

const requisitionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  measurements: {
    chest: { type: Number, min: 0, max: 200 },
    shoulders: { type: Number, min: 0, max: 100 },
    sleeveLengthLong: { type: Number, min: 0, max: 100 },
    sleeveLengthShort: { type: Number, min: 0, max: 100 },
    topLength: { type: Number, min: 0, max: 200 },
    neck: { type: Number, min: 0, max: 50 },
    tommy: { type: Number, min: 0, max: 200 },
    hip: { type: Number, min: 0, max: 200 },
    waist: { type: Number, min: 0, max: 200 },
    length: { type: Number, min: 0, max: 200 },
    lap: { type: Number, min: 0, max: 200 },
    base: { type: Number, min: 0, max: 200 },
    agbadaLength: { type: Number, min: 0, max: 200 },
    agbadaSleeve: { type: Number, min: 0, max: 100 }
  },
  contactInfo: {
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  notes: [{
    text: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Ensure either phone or email is provided in contactInfo
requisitionSchema.pre('validate', function(next) {
  if (this.contactInfo && !this.contactInfo.email && !this.contactInfo.phone) {
    this.invalidate('contactInfo.email', 'Either email or phone must be provided in contact info');
    this.invalidate('contactInfo.phone', 'Either email or phone must be provided in contact info');
  }
  next();
});

// Add indexes for better performance
requisitionSchema.index({ user: 1, status: 1 });
requisitionSchema.index({ createdAt: -1 });
requisitionSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Requisition', requisitionSchema); 