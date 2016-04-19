var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var port = process.env.PORT || 3001;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var routes = require('./routes/index');
var users = require('./routes/users');

var User = require('./models/User');


var app = express();

// view engine setup
var cons = require('consolidate');


// view engine setup

app.engine('html', cons.swig)
app.set('views', path.join(__dirname , '/views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public'))); //Old version
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(session({
  secret: 'password',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
//Initialize Passport and restore authentication state
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/users', users);


// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect mongoose
mongoose.connect('mongodb://localhost/Lolith', function(err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
  }
});


// Define routes.
app.get('/login_signup', function(req, res) {
  // res.sendfile('views/login_signup.html')
  res.render('login_signup', { title: 'Login' });
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/login_signup'
  })
);

  app.post('/signup', function(req, res, next) {
  console.log('registering user'+ req.body.email);
  User.register(new User({username: req.body.username}), req.body.password, function(err,account) {
    if (err) {
      console.log('error while user register!', err);
      return res.render('login_signup', { account : account });
    }

    console.log('user registered!');

    res.redirect('/');
  });
});



// Then
//app.use(express.static(process.env.PWD + '/htdocs'));



app.listen(port);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
