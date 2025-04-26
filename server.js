// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');//helps us see error messsages
require('dotenv').config();
var morgan       = require('morgan'); //seeing all log of requests//look at request being sent back and forth
var cookieParser = require('cookie-parser');//keep users loggged in
var bodyParser   = require('body-parser');
var session      = require('express-session');//keep users logged in

var configDB = require('./config/database.js');//instead of hardcoding we cand require our object

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {//connecting  to database
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);//call the routes file
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))//so we dont have to have individual routes


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2025a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
