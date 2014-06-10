

module.exports = function(app) {
    var io = require('socket.io').listen(http);
    //TODO: this is global right now make it private
    connections = {};
    io.on('connection', function(socket){
      connections[socket.id] = { user: null, socket: socket };
      socket.on('setUser', function(user) {
        connections[socket.id].user = user; 
      });
      socket.on('disconnect', function() {
          delete connections[socket.id];
      });
    });
};