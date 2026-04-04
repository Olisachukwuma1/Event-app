const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const User = require('../models/User')
const auth = require('../middleware/auth')

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Generate 6 digit code
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// @route POST /api/auth/login
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    console.log('Login attempt:', email)

    let user = await User.findOne({ email })

    // First time ever — no admin exists in the system
    const totalUsers = await User.countDocuments()
    if (totalUsers === 0) {
      console.log('First time setup — creating first admin')
      const hashedPassword = await bcrypt.hash(password, 10)
      user = new User({
        name: 'Admin',
        email,
        password: hashedPassword,
      })
      await user.save()
    } else {
      // Normal login — user must exist and password must match
      if (!user) {
        console.log('User not found')
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        console.log('Password does not match')
        return res.status(400).json({ message: 'Invalid credentials' })
      }
    }

    console.log('Login successful (password verified)')

    // Generate OTP code
    const code = generateCode()
    user.authCode = code
    user.authCodeExpires = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    console.log('Auth code:', code)

    // NON-BLOCKING email send
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Authentication Code',
      html: `<h2>Your code is: <strong>${code}</strong></h2>
             <p>Expires in 10 minutes</p>`,
    })

    // TEMP TOKEN (NOT FULL ACCESS YET)
    const token = jwt.sign(
      { id: user._id, name: user.name, verified: false },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    )

    res.json({ token })

  } catch (_err) {
    console.error(_err)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route POST /api/auth/verify-code
router.post('/verify-code', async (req, res) => {
  try {
    const { code } = req.body

    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.authCode !== code) {
      return res.status(400).json({ message: 'Invalid code' })
    }

    if (user.authCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Code has expired' })
    }

    // Clear code
    user.authCode = null
    user.authCodeExpires = null
    await user.save()

    // FINAL TOKEN (FULL ACCESS)
    const finalToken = jwt.sign(
      { id: user._id, name: user.name, verified: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({
      message: 'Code verified successfully',
      token: finalToken,
    })

  } catch (_err) {
    console.error(_err)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route POST /api/auth/resend-code
router.post('/resend-code', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const code = generateCode()
    user.authCode = code
    user.authCodeExpires = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    console.log('Resent auth code:', code)

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your New Authentication Code',
      html: `<h2>Your new code is: <strong>${code}</strong></h2>`,
    })

    res.json({ message: 'Code resent successfully' })

  } catch (_err) {
    console.error(_err)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route POST /api/auth/register
// @desc Create new admin (protected — only logged in admins)
router.post('/register', auth, async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashedPassword })
    await user.save()

    res.status(201).json({ message: 'Admin created successfully' })
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route GET /api/auth/admins
// @desc Get all admins (protected)
router.get('/admins', auth, async (req, res) => {
  try {
    const admins = await User.find().select('-password')
    res.json(admins)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route DELETE /api/auth/admins/:id
// @desc Delete admin (protected)
router.delete('/admins/:id', auth, async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }
    res.json({ message: 'Admin deleted successfully' })
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router