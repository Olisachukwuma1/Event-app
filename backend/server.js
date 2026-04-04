const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()
require("./conn/conn")
const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
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
