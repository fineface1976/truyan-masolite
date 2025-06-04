import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  Typography 
} from '@material-ui/core';
import { Send } from '@material-ui/icons';

export default function LiveChat({ sessionId, user }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket(`wss://yourdomain.com/live/${sessionId}/chat`);
    setWs(websocket);

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };

    return () => websocket.close();
  }, [sessionId]);

  const sendMessage = () => {
    if (message.trim() && ws) {
      ws.send(JSON.stringify({
        sender: user.name,
        text: message,
        timestamp: new Date().toISOString()
      }));
      setMessage('');
    }
  };

  return (
    <Box>
      <Typography variant="h6">Live Chat</Typography>
      <List style={{ maxHeight: '300px', overflow: 'auto' }}>
        {messages.map((msg, i) => (
          <ListItem key={i}>
            <ListItemText 
              primary={`${msg.sender}: ${msg.text}`}
              secondary={new Date(msg.timestamp).toLocaleTimeString()}
            />
          </ListItem>
        ))}
      </List>
      <Box display="flex">
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button onClick={sendMessage}><Send /></Button>
      </Box>
    </Box>
  );
}
