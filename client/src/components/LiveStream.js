 import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, TextField, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from '@material-ui/core';
import { Mic, Videocam, Favorite, Send, Chat, People } from '@material-ui/icons';

export default function LiveStream({ user }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [viewers, setViewers] = useState([]);

  // ... (keep existing code)

  return (
    <Box display="flex">
      {/* Video Stream */}
      <Box flex={3}>
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          style={{ width: '100%', maxHeight: '70vh' }}
        />
        <Typography variant="h5">{currentSession?.title}</Typography>
      </Box>

      {/* Sidebar */}
      <Box flex={1} p={2}>
        {/* Viewer List */}
        <Typography variant="h6">
          <People /> Viewers ({viewers.length})
        </Typography>
        <List>
          {viewers.map(viewer => (
            <ListItem key={viewer.id}>
              <Avatar src={viewer.avatar} />
              <ListItemText primary={viewer.name} />
            </ListItem>
          ))}
        </List>

        {/* Chat */}
        <Typography variant="h6">
          <Chat /> Live Chat
        </Typography>
        <Box height="300px" overflow="auto">
          {chatMessages.map((msg, index) => (
            <Typography key={index}>{msg.sender}: {msg.text}</Typography>
          ))}
        </Box>
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
      </Box>
    </Box>
  );
}
