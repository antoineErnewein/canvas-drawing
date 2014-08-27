var express = require('express'),
    app = express.createServer(express.logger()),
    io = require('socket.io').listen(app),
    routes = require('./routes');

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Heroku won't actually allow us to use WebSockets
// so we have to setup polling instead.
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
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

/*
io.sockets.on('connection', function (socket) {
  io.sockets.emit('status', { status: status }); // note the use of io.sockets to emit but socket.on to listen
  socket.on('reset', function (data) {
    status = "War is imminent!";
    io.sockets.emit('status', { status: status });
  });
});*/