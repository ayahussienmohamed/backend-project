require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const path = require('path')
const app = express()
const corsOptions = require('./config/corsOptions')

const PORT= process.env.PORT|| 5000
const DB = require('./config/db')
const { logger, logEvents } = require('./middleware/logger')
const {errorHandler} = require('./middleware/errorLogger')
const noteRoutes = require('./routes/noteRouter')
const userRoute = require('./routes/userRouter')
const authRoute = require('./routes/authRouter')

DB()
app.use(logger)

app.use(express.json())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))


app.use(cors())
app.use(cookieParser())

app.use('/auth', authRoute)
app.use('/users', userRoute)
app.use('/notes', noteRoutes)


app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
    } else {
      res.type('txt').send('404 Not Found')
    }
  })
app.listen(PORT,()=>{
    console.log("The Application is running on port", PORT)
})