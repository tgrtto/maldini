var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var managersRouter = require('./routes/managers');

var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var pg = require('./config/pg');

var cors = require('cors');

var app = express();
app.use(cors({origin:['http://localhost:4200', 'https://admin.gopamoja.com', 'https://test.admin.gopamoja.com'], credentials: true}));
app.use(session({
  store: new pgSession({
    pool : pg,
    tableName : 'sessions'
  }),
  secret: "hellogopamoja",
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, domain:'.gopamoja.com', secure: false},
  saveUninitialized: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', managersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
