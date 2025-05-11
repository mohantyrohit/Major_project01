const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const jwt = require('jsonwebtoken');
const Student = require('../models/studentUser');

// Initialize a new chat session
router.post('/initialize', async (req, res) => {
  const { instituteId, userName, userEmail, studentId, collegeName } = req.body;
  
  if (!instituteId || !userName || !userEmail || !collegeName) {
    return res.status(400).json({ error: 'Required fields missing' });
  }
  
  try {
    // Check if chat already exists for this user and institute
    let chat = await Chat.findOne({ 
      instituteId, 
      userEmail 
    });
    
    if (chat) {
      // If chat exists, just return it
      return res.status(200).json(chat);
    }
    
    // Create new chat with welcome message
    const newChat = new Chat({
      instituteId,
      userName,
      userEmail,
      studentId: studentId || null, // Handle case when studentId is not provided
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
    res.status(500).json({ error: 'Failed to start chat session', details: error.message });
  }
});

// Send a message in an existing chat
router.post('/message', async (req, res) => {
  const { instituteId, userName, userEmail, studentId, message, collegeName } = req.body;
  
  if (!instituteId || !userName || !userEmail || !message || !collegeName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Find the existing chat or create a new one
    let chat = await Chat.findOne({ 
      instituteId, 
      userEmail 
    });
    
    if (!chat) {
      // Create a new chat if not found
      chat = new Chat({
        instituteId,
        userName,
        userEmail,
        studentId: studentId || null,
        collegeName,
        messages: []
      });
    }
    
    // Add the new message
    chat.messages.push({
      sender: 'user',
      text: message,
      timestamp: new Date(),
    });
    
    // Add automatic response
    const autoResponse = getAutomaticResponse(message, collegeName);
    chat.messages.push({
      sender: 'institute',
      text: autoResponse,
      timestamp: new Date(Date.now() + 1000), // 1 second later
    });
    
    const updatedChat = await chat.save();
    res.status(200).json(updatedChat);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
});

// Get chat history for a specific user with an institute
router.get('/history/:instituteId/:userEmail', async (req, res) => {
  const { instituteId, userEmail } = req.params;
  
  try {
    const chat = await Chat.findOne({ 
      instituteId, 
      userEmail 
    });
    
    if (!chat) {
      return res.status(404).json({ message: 'No chat history found' });
    }
    
    res.status(200).json(chat);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history', details: error.message });
  }
});
// JWT verification middleware
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  
  if (bearerHeader) {
    const token = bearerHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Invalid token:', error);
      // Continue without token data - don't block non-authenticated users
      next();
    }
  } else {
    // No token provided, but still allow access for non-authenticated users
    next();
  }
};
// Helper function for automatic responses
function getAutomaticResponse(message, collegeName) {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('admission') || lowerMsg.includes('apply')) {
    return `Thank you for your interest in admissions. Please visit our admission portal on our website for detailed information about the application process.`;
  } else if (lowerMsg.includes('fee') || lowerMsg.includes('cost') || lowerMsg.includes('tuition')) {
    return 'Our fee structure varies by program. We can email you the detailed fee structure for your program of interest. Could you please specify which program you\'re interested in?';
  } else if (lowerMsg.includes('scholarship')) {
    return 'We offer various merit-based and need-based scholarships. Eligibility criteria and application details can be found on our website under the Scholarships section.';
  } else if (lowerMsg.includes('hostel') || lowerMsg.includes('accommodation')) {
    return 'Yes, we provide on-campus accommodation for both boys and girls with modern amenities and security. The allocation is based on first-come-first-serve basis after admission.';
  } else {
    return `Thank you for your message. Our team at ${collegeName} will get back to you shortly with more information. If this is urgent, please call us directly at our helpline.`;
  }
}

module.exports = router;