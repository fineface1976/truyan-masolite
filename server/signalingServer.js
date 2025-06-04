const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    // Broadcast offers/answers to peers
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: data.type,
          sdp: data.sdp,
          sender: data.sender
        }));
      }
    });
  });
});

console.log('Signaling server running on ws://localhost:8080');
