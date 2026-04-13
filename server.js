require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors({ origin: ['http://localhost:5173', 'https://fake-news-detection-system-fc0l.onrender.com'] }))
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/community', require('./routes/community'))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
  })
  .catch(err => console.error(err))
