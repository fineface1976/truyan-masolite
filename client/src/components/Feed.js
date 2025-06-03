import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  CardMedia, 
  IconButton,
  TextField,
  Avatar,
  Box
} from '@material-ui/core';
import { 
  Favorite, 
  Comment, 
  Share, 
  Send,
  Mic
} from '@material-ui/icons';
import axios from 'axios';
import { useWeb3 } from '../hooks/useWeb3';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const { web3, account, mazolContract } = useWeb3();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('/api/posts');
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/posts', { content: newPost });
      setPosts([data, ...posts]);
      setNewPost('');
      
      // Reward user with MAZOL for posting
      if (web3 && mazolContract) {
        await mazolContract.methods
          .transfer(account, web3.utils.toWei('1', 'ether'))
          .send({ from: account });
      }
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`/api/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, likes: [...post.likes, account] } 
          : post
      ));
      
      // Reward user for engagement
      if (web3 && mazolContract) {
        await mazolContract.methods
          .transfer(account, web3.utils.toWei('0.5', 'ether'))
          .send({ from: account });
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  return (
    <Box>
      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <form onSubmit={handlePostSubmit}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="What's happening?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <IconButton>
                <Mic /> {/* Voice note attachment */}
              </IconButton>
              <IconButton type="submit">
                <Send />
              </IconButton>
            </Box>
          </form>
        </CardContent>
      </Card>

      {posts.map(post => (
        <Card key={post._id} style={{ marginBottom: '20px' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar src={post.author.avatar} />
              <Typography variant="subtitle1" style={{ marginLeft: '10px' }}>
                {post.author.name}
              </Typography>
            </Box>
            <Typography paragraph>{post.content}</Typography>
            {post.media?.map(media => (
              <CardMedia
                key={media.url}
                component={media.mediaType === 'video' ? 'video' : 'img'}
                src={media.url}
                controls
                style={{ maxHeight: '500px', marginBottom: '10px' }}
              />
            ))}
            <Box display="flex" justifyContent="space-between">
              <IconButton onClick={() => handleLike(post._id)}>
                <Favorite color={post.likes.includes(account) ? 'secondary' : 'inherit'} />
                <Typography>{post.likes.length}</Typography>
              </IconButton>
              <IconButton>
                <Comment />
                <Typography>{post.comments.length}</Typography>
              </IconButton>
              <IconButton>
                <Share />
                <Typography>{post.shares}</Typography>
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
    
