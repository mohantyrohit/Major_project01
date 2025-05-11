const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const jwt = require('jsonwebtoken');
const Student = require('../models/studentUser');

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

// Initialize a new chat session
router.post('/initialize', async (req, res) => {
  const { instituteId, userName, userEmail, studentId, collegeName } = req.body;
  
  // Log received data
  console.log('Chat initialization request received:', {
    instituteId, 
    userName, 
    userEmail, 
    studentId,
    collegeName
  });
  
  if (!instituteId || !userName || !userEmail || !collegeName) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields for chat initialization' 
    });
  }

  try {
    // Check if a chat already exists for this user and institute
    let existingChat = await Chat.findOne({
      instituteId,
      userEmail
    });

    if (existingChat) {
      // Return existing chat if found
      console.log('Existing chat found for this user and institute');
      return res.status(200).json({
        success: true,
        chatId: existingChat._id,
        messages: existingChat.messages
      });
    } else {
      // Create a new chat session
      const newChat = new Chat({
        instituteId,
        userName,
        userEmail,
        studentId: studentId || null, // Handle null/undefined
        collegeName,
        messages: [{
          sender: 'institute',
          text: `Hello ${userName}, welcome to ${collegeName} chat support! How can we assist you today?`,
          timestamp: new Date()
        }]
      });

      const savedChat = await newChat.save();
      console.log('New chat session created:', savedChat._id);

      return res.status(201).json({
        success: true,
        chatId: savedChat._id,
        messages: savedChat.messages
      });
    }
  } catch (error) {
    console.error('Error initializing chat:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while initializing chat session'
    });
  }
});

// Send a message
router.post('/message', verifyToken, async (req, res) => {
  const { instituteId, userName, userEmail, studentId, message, collegeName } = req.body;
  
  // Log received data
  console.log('New message received:', {
    instituteId,
    userName,
    userEmail,
    studentId,
    messageSummary: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
    collegeName
  });

  if (!instituteId || !userName || !userEmail || !message) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields for sending message'
    });
  }

  try {
    // Find existing chat or create a new one
    let chat = await Chat.findOne({
      instituteId,
      userEmail
    });

    if (!chat) {
      // Create new chat if none exists
      chat = new Chat({
        instituteId,
        userName,
        userEmail,
        studentId: studentId || null,
        collegeName,
        messages: []
      });
    }

    // Add user message
    chat.messages.push({
      sender: 'user',
      text: message,
      timestamp: new Date()
    });

    // Generate automated response based on message content
    const response = generateAutomatedResponse(message, collegeName);
    
    // Add institute response
    chat.messages.push({
      sender: 'institute',
      text: response,
      timestamp: new Date()
    });

    // Update lastUpdated timestamp
    chat.lastUpdated = new Date();

    // Save updated chat
    await chat.save();
    console.log('Chat updated with new messages');

    return res.status(200).json({
      success: true,
      chatId: chat._id,
      messages: chat.messages
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while processing message'
    });
  }
});

// Helper function to generate automated responses
const generateAutomatedResponse = (message, collegeName) => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('admission') || lowerMsg.includes('apply')) {
    return `Thank you for your interest in admissions at ${collegeName}. Please visit our admission portal on our website for detailed information about the application process.`;
  } else if (lowerMsg.includes('fee') || lowerMsg.includes('cost') || lowerMsg.includes('tuition')) {
    return 'Our fee structure varies by program. We can email you the detailed fee structure for your program of interest. Could you please specify which program you\'re interested in?';
  } else if (lowerMsg.includes('scholarship')) {
    return 'We offer various merit-based and need-based scholarships. Eligibility criteria and application details can be found on our website under the Scholarships section.';
  } else if (lowerMsg.includes('hostel') || lowerMsg.includes('accommodation')) {
    return 'Yes, we provide on-campus accommodation for both boys and girls with modern amenities and security. The allocation is based on first-come-first-serve basis after admission.';
  } else {
    return 'Thank you for your message. Our team will get back to you shortly with more information. If this is urgent, please call us directly at our helpline.';
  }
};

// Get chat history
router.get('/history/:instituteId/:userEmail', verifyToken, async (req, res) => {
  const { instituteId, userEmail } = req.params;

  if (!instituteId || !userEmail) {
    return res.status(400).json({
      success: false,
      message: 'Institute ID and user email are required'
    });
  }

  try {
    const chat = await Chat.findOne({
      instituteId,
      userEmail: decodeURIComponent(userEmail)
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'No chat history found'
      });
    }

    console.log(`Retrieved chat history for ${userEmail} with institute ${instituteId}`);
    return res.status(200).json({
      success: true,
      chatId: chat._id,
      messages: chat.messages
    });
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving chat history'
    });
  }
});

// Get all chats for an institute (for admin/institute users)
router.get('/institute/:instituteId', verifyToken, async (req, res) => {
  const { instituteId } = req.params;

  // This endpoint should be admin-protected
  if (!req.user || !req.user.role || req.user.role !== 'institute') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access'
    });
  }

  try {
    const chats = await Chat.find({ 
      instituteId 
    }).sort({ lastUpdated: -1 });

    return res.status(200).json({
      success: true,
      count: chats.length,
      chats: chats
    });
  } catch (error) {
    console.error('Error retrieving institute chats:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving institute chats'
    });
  }
});

// Delete a chat
router.delete('/:chatId', verifyToken, async (req, res) => {
  const { chatId } = req.params;

  // This endpoint should be admin-protected
  if (!req.user || !req.user.role || req.user.role !== 'institute') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access'
    });
  }

  try {
    const result = await Chat.findByIdAndDelete(chatId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting chat'
    });
  }
});

// Get student chats (for students to see their own chats)
router.get('/student', verifyToken, async (req, res) => {
  // Check if user is authenticated
  if (!req.user || !req.user._id) {
    return res.status(403).json({
      success: false,
      message: 'Authentication required'
    });
  }

  try {
    // Find the student to get their email
    const student = await Student.findById(req.user._id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Find all chats for this student's email
    const chats = await Chat.find({
      userEmail: student.email
    }).sort({ lastUpdated: -1 });

    return res.status(200).json({
      success: true,
      count: chats.length,
      chats: chats
    });
  } catch (error) {
    console.error('Error retrieving student chats:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving student chats'
    });
  }
});

module.exports = router;