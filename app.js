var express    = require('express')        // call express
var app        = express()                 // define our app using express
var bodyParser = require('body-parser')

// Import configuration variables
var env        = process.env.NODE_ENV || "development"
// var config     = require(__dirname + '/config/config.json')[env]

var path       = require('path')
// var logger     = require('morgan')
// var debug      = require('debug')('users')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// set our port
var port = process.env.PORT || 3000        

// Initialize passport for authentication
// Do we need this for node-acl?  Possibly.
// app.use(passport.session()); // persistent login sessions

// REGISTER OUR ROUTES -------------------------------
// all of our version 01 routes will be prefixed with /v01
app.use('/v01', require('./routes/v01'))

// static file serve
// app.use(express.static(path.join(__dirname, '/public/')))

// // This sends the Index for everything else....
// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, './public/index.html')) 
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  // debug("Using Development Error Handling")
  app.use(function(err, req, res, next) {
    // debug("ERROR ERROR ERROR ERROR")
    // debug(err)
    res.status(err.status || 500).send("Error [DEV] " + err)
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).send("Error [PROD]")
})


// START THE SERVER
// =============================================================================
// app.listen(port)
// console.log('Magic happens on port ' + port)

module.exports = app