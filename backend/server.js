const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()
require("./conn/conn")
const app = express()

const allowedOrigins = [
  "http://localhost:5173",
    "http://localhost:5174",
  "https://event-app-five-chi.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes

app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))


//server
app.listen (process.env.PORT, () => {
    console.log(`Server Started at ${process.env.PORT}`);
});
