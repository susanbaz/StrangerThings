// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('./db/models/message');

// Create a new message for a post
router.post('/:postId/messages', async (req, res) => {
  const { content, senderId } = req.body;
  const postId = req.params.postId;
  try {
    const newMessage = await Message.createMessage(content, senderId, postId);
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all messages for a post
router.get('/:postId/messages', async (req, res) => {
  const postId = req.params.postId;
  try {
    const messages = await Message.getMessagesForPost(postId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all messages sent by a user
router.get('/sender/:senderId/messages', async (req, res) => {
  const senderId = req.params.senderId;
  try {
    const messages = await Message.getMessagesBySender(senderId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
