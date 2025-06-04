const WebSocket = require('ws');
const LiveSession = require('../models/LiveSession');

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      const data = JSON.parse(message);
      
      if (data.type === 'join') {
        const session = await LiveSession.findById(data.sessionId);
        session.viewers.push(data.userId);
        await session.save();
        
        // Broadcast updated viewer count
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'viewerUpdate',
              count: session.viewers.length
            }));
          }
        });
      }
    });
  });
};
