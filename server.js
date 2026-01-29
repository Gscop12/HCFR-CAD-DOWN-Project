// HCFR CAD-DOWN: Minimal Node.js + Socket.IO server for real-time sync
// 1. Run: npm install express socket.io
// 2. Start: node server.js
// 3. Visit: http://localhost:3000/hcfr_cad_down_v966_manual_roster_lineup_map_wired.html.html

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// In-memory canonical call log and status (replace with DB for production)
let callLog = [];
let unitStatusMap = {};
let messages = [];

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Socket.IO real-time API
io.on('connection', (socket) => {
  // Initial sync
  socket.emit('init', { callLog, unitStatusMap, messages });

  // Call log updates
  socket.on('updateCallLog', (calls) => {
    callLog = calls;
    socket.broadcast.emit('callLogUpdated', callLog);
  });

  // Unit status updates
  socket.on('updateUnitStatus', (statusMap) => {
    unitStatusMap = statusMap;
    socket.broadcast.emit('unitStatusUpdated', unitStatusMap);
  });

  // Messaging
  socket.on('newMessage', (msg) => {
    messages.push(msg);
    socket.broadcast.emit('messageAdded', msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HCFR CAD-DOWN server running at http://localhost:${PORT}/`);
});
