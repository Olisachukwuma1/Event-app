const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const auth = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

// @route GET /api/events
// @desc Get all events (protected)
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 })
    res.json(events)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route GET /api/events/public
// @desc Get all events (public)
router.get('/public', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 })
    res.json(events)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route GET /api/events/:id
// @desc Get single event (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json(event)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route POST /api/events
// @desc Create event (protected)
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    console.log("BODY:", req.body)
console.log("FILE:", req.file)

    const { title, date, time, venue } = req.body

    const event = new Event({
      title,
      date,
      time,
      venue,
    photo: req.file ? req.file.path : ''
    })

    await event.save()
    res.status(201).json(event)
  } catch (_err) {
       console.error('Event error message:', _err.message)
    console.error('Event error stack:', _err.stack)
    
    res.status(500).json({ message: 'Server error' })
  }
})

// @route PUT /api/events/:id
// @desc Update event (protected)
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const { title, date, time, venue } = req.body

    const updateData = { title, date, time, venue }
    if (req.file) {
      updateData.photo = req.file.path
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.json(event)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route DELETE /api/events/:id
// @desc Delete event (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json({ message: 'Event deleted successfully' })
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router