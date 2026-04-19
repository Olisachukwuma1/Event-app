const express = require('express')
const router = express.Router()
const Slider = require('../models/Slider')
const auth = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

// @route GET /api/sliders/public
// @desc Get all active sliders (public)
router.get('/public', async (req, res) => {
  try {
    const now = new Date()
    const sliders = await Slider.find({
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    }).sort({ createdAt: -1 })
    res.json(sliders)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route GET /api/sliders
// @desc Get all sliders (protected)
router.get('/', auth, async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ createdAt: -1 })
    res.json(sliders)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route GET /api/sliders/:id
// @desc Get single slider (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id)
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' })
    }
    res.json(slider)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route POST /api/sliders
// @desc Create slider (protected)
router.post('/', auth, upload.fields([
  { name: 'desktopImage', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, link, expiresAt } = req.body

    const slider = new Slider({
      title,
      link: link || null,
      expiresAt: expiresAt || null,
      desktopImage: req.files['desktopImage'] ? req.files['desktopImage'][0].path : null,
      mobileImage: req.files['mobileImage'] ? req.files['mobileImage'][0].path : null,
    })

    await slider.save()
    res.status(201).json(slider)
  } catch (_err) {
    console.error('Slider error:', _err.message)
    res.status(500).json({ message: _err.message || 'Server error' })
  }
})

// @route PUT /api/sliders/:id
// @desc Update slider (protected)
router.put('/:id', auth, upload.fields([
  { name: 'desktopImage', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, link, expiresAt } = req.body

    const updateData = {
      title,
      link: link || null,
      expiresAt: expiresAt || null,
    }

    if (req.files['desktopImage']) {
      updateData.desktopImage = req.files['desktopImage'][0].path
    }
    if (req.files['mobileImage']) {
      updateData.mobileImage = req.files['mobileImage'][0].path
    }

    const slider = await Slider.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )

    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' })
    }

    res.json(slider)
  } catch (_err) {
    console.error('Slider error:', _err.message)
    res.status(500).json({ message: _err.message || 'Server error' })
  }
})

// @route DELETE /api/sliders/:id
// @desc Delete slider (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const slider = await Slider.findByIdAndDelete(req.params.id)
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' })
    }
    res.json({ message: 'Slider deleted successfully' })
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router