var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var session = require('express-session');

var routes = require('./routes/index');
var actions = require('./routes/actions');
var home = require('./routes/home');
var users = require('./routes/users');
var SessionStore = require("connect-mongo")(session);
var store = new SessionStore({
    url: "mongodb://localhost/session",
    interval: 120000
});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(cookieSession({secret : 'fens.me'}));
app.use(session({
    secret : 'fens.me',
    store: store,
    cookie: { maxAge: 900000 }
}));
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

//session—È÷§
app.get('/', function (req, res, next) {
    if (req.session.user) {
        res.redirect('/home');
    }
    next();
});
app.get('/users', function (req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    }
    next();
});
app.get('/home', function (req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    }
    next();
});

app.use('/', routes);
app.use('/actions', actions);
app.use('users',users);
app.use('/home', home);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
