import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { Mic, Videocam, Favorite, Send } from '@material-ui/icons';
import axios from 'axios';
import { useWeb3 } from '../hooks/useWeb3';

export default function LiveStream({ user }) {
  const [isLive, setIsLive] = useState(false);
  const [liveSessions, setLiveSessions] = useState([]);
  const [viewers, setViewers] = useState(0);
  const [tipAmount, setTipAmount] = useState(1);
  const [tipMessage, setTipMessage] = useState('');
  const [openTipDialog, setOpenTipDialog] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  
  const videoRef = useRef(null);
  const { web3, account, mazolContract } = useWeb3();

  // Check if user can go live
  const canGoLive = user.followers >= 500;

  const startStream = async () => {
    try {
      const { data } = await axios.post('/api/live/start', {
        title: `${user.name}'s Live Stream`
      });
      
      // Initialize WebRTC
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsLive(true);
      setCurrentSession(data);
    } catch (err) {
      console.error('Error starting stream:', err);
    }
  };

  const sendTip = async () => {
    try {
      // Convert to wei
      const amountInWei = web3.utils.toWei(tipAmount.toString(), 'ether');
      
      // Transfer tokens
      await mazolContract.methods
        .transfer(currentSession.host.walletAddress, amountInWei)
        .send({ from: account });
      
      // Record tip
      await axios.post(`/api/live/${currentSession._id}/tip`, {
        amount: tipAmount,
        message: tipMessage
      });
      
      setOpenTipDialog(false);
    } catch (err) {
      console.error('Error sending tip:', err);
    }
  };

  return (
    <Box>
      {isLive ? (
        <Box>
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            style={{ width: '100%', maxHeight: '70vh' }}
          />
          <Typography variant="h5">{currentSession?.title}</Typography>
          <Typography>Viewers: {viewers}</Typography>
          
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => setOpenTipDialog(true)}>
              <Favorite color="secondary" />
            </IconButton>
            <Typography>Tips: {currentSession?.totalTips || 0} MZLx</Typography>
          </Box>
        </Box>
      ) : (
        <Box textAlign="center" p={4}>
          {canGoLive ? (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Videocam />}
              onClick={startStream}
            >
              Go Live
            </Button>
          ) : (
            <Typography color="error">
              You need 500 followers to start a live session
            </Typography>
          )}
        </Box>
      )}

      <Dialog open={openTipDialog} onClose={() => setOpenTipDialog(false)}>
        <DialogTitle>Send Tip</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount (MZLx)"
            type="number"
            value={tipAmount}
            onChange={(e) => setTipAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Message"
            value={tipMessage}
            onChange={(e) => setTipMessage(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTipDialog(false)}>Cancel</Button>
          <Button onClick={sendTip} color="primary">Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
