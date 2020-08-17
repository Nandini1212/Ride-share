let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
let session = require('express-session');
global.CryptoJS = require('crypto-js');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let vehicleRouter = require('./routes/vehicle');
let authentication = require('./routes/authentication');
let booking = require('./routes/booking');
let feedbackRouter = require('./routes/feedback');
let adminRouter = require('./routes/admin');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({ secret: 'car rental application session', cookie: { maxAge: 7200000, sameSite: false } }));

const redirectToLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login");
  } else {
    next();
  }
};

const redirectToHome = (req, res, next) => {
  if (req.session.userId){
    if (req.session.isAdmin === 1 || req.session.isAdmin === "1"){
      res.redirect("/admin/dashboard");
    }else {
      res.redirect("/users");
    }
  }else {
    next();
  }
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/login', redirectToHome, authentication);
app.use('/users', redirectToLogin, usersRouter);
app.use('/vehicle', redirectToLogin, vehicleRouter);
app.use('/', authentication);
app.use("/booking", redirectToLogin, booking);
app.use('/feedback', redirectToLogin, feedbackRouter);
app.use('/admin', redirectToLogin, adminRouter);

// Removes favicon error
app.use(function (req, res) {
  res.status(204);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start the server on port 3000
app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');

module.exports = app;
