const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Initialize new chat
router.post('/initialize', async (req, res) => {
  const { instituteId, userName, userEmail, studentId, collegeName } = req.body;

  try {
    const newChat = new Chat({
      instituteId,
      userName,
      userEmail,
      studentId,
      collegeName,
      messages: [{
        sender: 'institute',
        text: `Hello ${userName}, welcome to ${collegeName} chat support! How can we assist you today?`
      }]
    });

    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    console.error('Error initializing chat:', error);
    res.status(500).json({ error: 'Failed to start chat session' });
  }
});

// Send message to an existing chat or create if missing
router.post('/message', async (req, res) => {
  const { instituteId, userName, userEmail, studentId, message, collegeName } = req.body;

  try {
    // Try to find existing chat
    let chat = await Chat.findOne({ instituteId, userEmail });

    if (!chat) {
      chat = new Chat({
        instituteId,
        userName,
        userEmail,
        studentId,
        collegeName,
        messages: []
      });
    }

    chat.messages.push({
      sender: 'user',
      text: message
    });

    const updatedChat = await chat.save();
    res.status(200).json(updatedChat);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// (Optional) Fetch chat history for a user
router.get('/history/:userEmail', async (req, res) => {
  try {
    const chat = await Chat.findOne({ userEmail: req.params.userEmail });
    if (!chat) {
      return res.status(404).json({ message: 'No chat history found' });
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

module.exports = router;
