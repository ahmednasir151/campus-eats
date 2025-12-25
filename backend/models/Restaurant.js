const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300'
  },
  cuisine: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  deliveryTime: {
    type: String,
    default: '30-45 mins'
  },
  minimumOrder: {
    type: Number,
    default: 0
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  openingHours: {
    open: { type: String, default: '9:00 AM' },
    close: { type: String, default: '10:00 PM' }
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);