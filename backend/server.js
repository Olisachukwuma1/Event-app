const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()
require("./conn/conn")
const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://event-o3ri867m6-olisachukwuma1s-projects.vercel.app'
  ],
  credentials: true,
}))

app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes

app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))


//server
app.listen (process.env.PORT, () => {
    console.log(`Server Started at ${process.env.PORT}`);
});
