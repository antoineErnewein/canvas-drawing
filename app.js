var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express.createServer();
var io = require('socket.io').listen(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

// Routes

var port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000
app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

app.get('/', routes.index);

var status = "All is well.";

io.sockets.on('connection', function(socket) {
    socket.on('drawClick', function(data) {
      socket.broadcast.emit('draw', {
        x: data.x,
        y: data.y,
        type: data.type
      });
    });
  });