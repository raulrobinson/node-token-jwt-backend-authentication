const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const dbConfig = require('./database/db')

// Express APIs
const api = require('./routes/auth.routes')

// MongoDB conection
var mongoURI
mongoose.connection.on('open', function (ref) {
  console.log('Connected to mongo server.')
  return start_up()
})

mongoose.connection.on('error', function (err) {
  console.log('Could not connect to mongo server!')
  return console.log(err)
})

mongoURI = dbConfig

// Remvoe MongoDB warning error
mongoose.set('useCreateIndex', true)

// Express settings
const app = express()
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
app.use(cors())

// Serve static resources
app.use('/public', express.static('public'))

app.use('/api', api)

// Define PORT
const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Express error handling
app.use((req, res, next) => {
  setImmediate(() => {
    next(new Error('Something went wrong'))
  })
})

app.use(function (err, req, res, next) {
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.message)
})
