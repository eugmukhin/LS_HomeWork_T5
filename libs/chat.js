const cookie = require('cookie');
const auth = require('./auth');
const chatUsers = {};

module.exports.onConnection = function (socket) {
  /* const token = cookie.parse(socket.handshake.headers.cookie).access_token;
  if (token) {
    auth.findUserByToken(token).then(user => {
      if (user) {
        console.log(`User ${user.username} connect. Socket.id - ${socket.id}`);
        chatUsers[socket.id] = { username: user.username, id: socket.id };
        socket.emit('all users', chatUsers);
        socket.broadcast.emit('new user', chatUsers[socket.id]);
      } else {
        socket.disconnect(true);
      }
    });
  } */

  const { username } = socket.handshake.headers;

  console.log(`User ${username} connect. Socket.id - ${socket.id}`);
  chatUsers[socket.id] = { username: username, id: socket.id };
  socket.emit('all users', chatUsers);
  socket.broadcast.emit('new user', chatUsers[socket.id]);

  socket.on('disconnect', function (data) {
    if (chatUsers[socket.id]) {
      console.log(`User ${chatUsers[socket.id].username} disconnect. Socket.id - ${socket.id}`);
      socket.broadcast.emit('delete user', chatUsers[socket.id].id);
      delete chatUsers[socket.id];
    } else {
      console.log(`Socket.id ${socket.id} disconnect.`);
    }
  });

  socket.on('chat message', function (message, recipient) {
    socket.broadcast.to(recipient).emit('chat message', message, socket.id);
  });
};
