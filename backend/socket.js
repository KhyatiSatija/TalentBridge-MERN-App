const socketIo = require('socket.io');

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: { origin: "*" }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('message', (msg) => {
      console.log('Received message:', msg);
      socket.emit('message', `Server received: ${msg}`);
    });

    socket.on("test", (data) => {
        console.log("Received test event from client:", data);
    });
   
    socket.on("joinRoom", (developerId) => {
        socket.join(developerId);
        console.log(`Developer ${developerId} joined their room.`);
    });


    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  return io;
}

function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = { initializeSocket, getIo };
