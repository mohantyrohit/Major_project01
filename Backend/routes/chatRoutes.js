const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Initialize a new chat session (if it doesn't exist)
router.post('/initialize', async (req, res) => {
  const { instituteId, userName, userEmail, studentId, collegeName } = req.body;

  if (!instituteId || !userName || !userEmail || !collegeName) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  try {
    // Check if chat already exists
    const existingChat = await Chat.findOne({ instituteId, userEmail });
    if (existingChat) {
      return res.status(200).json(existingChat); // Return existing chat
    }

    // Create new chat
    const newChat = new Chat({
      instituteId,
      userName,
      userEmail,
      studentId,
      collegeName,
      messages: [{
        sender: 'institute',
        text: `Hello ${userName}, welcome to ${collegeName} chat support! How can we assist you today?`,
        timestamp: new Date(),
      }]
    });

    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    console.error('Error initializing chat:', error);
    res.status(500).json({ error: 'Failed to start chat session' });
  }
});

// Send a message in an existing chat or create new if missing
router.post('/message', async (req, res) => {
  const { instituteId, userName, userEmail, studentId, message, collegeName } = req.body;

  if (!instituteId || !userName || !userEmail || !message || !collegeName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let chat = await Chat.findOne({ instituteId, userEmail });

    if (!chat) {
      // Initialize chat if not found
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
      text: message,
      timestamp: new Date(),
    });

    const updatedChat = await chat.save();
    res.status(200).json(updatedChat);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get chat history for a specific user (by email)
router.get('/history/:userEmail', async (req, res) => {
  const userEmail = req.params.userEmail;

  try {
    const chat = await Chat.findOne({ userEmail });

    if (!chat) {
      return res.status(404).json({ message: 'No chat history found' });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

module.exports = router;
