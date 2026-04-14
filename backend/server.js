const express = require('express')
const cors = require('cors')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()
require('./conn/conn')

console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
})

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
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
    methods: ['GET', 'POST'],
  },
})

// Make io accessible in routes
app.set('io', io)

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

// Socket connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

// Server
server.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PORT}`)
})