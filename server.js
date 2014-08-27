(function() {

  var port = process.env.PORT || 3000;

  var io;
  io = require('socket.io').listen(port);
  io.sockets.on('connection', function(socket) {
    socket.on('drawClick', function(data) {
      socket.broadcast.emit('draw', {
        x: data.x,
        y: data.y,
        type: data.type
      });
    });
  });
}).call(this);
