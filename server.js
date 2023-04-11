const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = socket(server);
const messages = [];
const users = [];

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('join', (name) => {
    console.log(name + ' has joined with socket id ' + socket.id);
    users.push({ name: name, id: socket.id });
    console.log(users);
    socket.broadcast.emit('newUser', { author: name, content: `${name} has joined the conversation!` });
    io.emit('users', users);
  });

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
    const index = users.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      const name = users[index].name;
      users.splice(index, 1);
      const message = `${name} has left the conversation... :(`;
      io.emit('removeUser', { author: 'Chat Bot', content: message, userName: name });
      io.emit('users', users);
      console.log(name + ' has disconnected');
    }
  });

  console.log('I\'ve added a listener on message event \n');

  socket.on('message', (message) => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
});