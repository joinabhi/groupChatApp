// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// // app.get('/', (req, res) => {
// //   res.sendFile(__dirname + '/index.html');
// // });

// const users = {};

// io.on('connection', socket => {
//   socket.on('new-user-joined', name => {
//     console.log("new user", name);
//     users[socket.id] = name;
//     socket.broadcast.emit('user-joined', name);
//   });

//   socket.on('send', message => {
//     socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
//   });
// });

// server.listen(5100, () => {
//   console.log('Server is running on http://localhost:5100');
// });
