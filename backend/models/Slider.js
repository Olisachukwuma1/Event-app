const mongoose = require('mongoose')

const sliderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desktopImage: {
    type: String,
    default: null,
  },
  mobileImage: {
    type: String,
    default: null,
  },
  link: {
    type: String,
    default: null,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true })

module.exports = mongoose.model('Slider', sliderSchema)