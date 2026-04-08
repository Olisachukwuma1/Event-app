const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()
require('./conn/conn')

const app = express()

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      origin.endsWith('.vercel.app') ||
      origin === 'http://localhost:3000' ||
      origin === 'http://localhost:3001' 
    ) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))

app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

// Server
app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PORT}`)
})