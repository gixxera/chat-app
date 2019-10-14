const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New WebSocket connection!');

  socket.on('join', ({ username, room }) => {
    socket.join(room); // Allows us to join a given chat room and pass name of the room we want to join


    socket.emit('message', generateMessage('Welcome'));
    socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`)); // send a message for everyone except the new user
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    io.to('2').emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', (location, callback) => {
    io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`));
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left!'));
  });

});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

