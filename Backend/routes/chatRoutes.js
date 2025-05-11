// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ChatSession = require('../models/Chat');
const Institute = require('../models/Institute'); // Assuming you have this model
const Student = require('../models/Student'); // Assuming you have this model
const auth = require('../middleware/auth'); // Authentication middleware
const { check, validationResult } = require('express-validator');

// Middleware to validate ObjectId
const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * @route   POST api/chat/initialize
 * @desc    Initialize a new chat session
 * @access  Public
 */
router.post('/initialize', [
  check('instituteId', 'Institute ID is required').not().isEmpty(),
  check('userName', 'Name is required').not().isEmpty(),
  check('userEmail', 'Please include a valid email').isEmail(),
  check('collegeName', 'College name is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { instituteId, userName, userEmail, studentId, collegeName } = req.body;
    
    // Validate instituteId is a valid ObjectId
    if (!validateObjectId(instituteId)) {
      return res.status(400).json({ msg: 'Invalid institute ID format' });
    }
    
    // If studentId is provided, validate it's a valid ObjectId
    if (studentId && !validateObjectId(studentId)) {
      return res.status(400).json({ msg: 'Invalid student ID format' });
    }

    // Check if institute exists
    const institute = await Institute.findById(instituteId);
    if (!institute) {
      return res.status(404).json({ msg: 'Institute not found' });
    }

    // Check if there's an existing active session for this user with this institute
    let chatSession = await ChatSession.findOne({
      instituteId,
      userEmail,
      status: 'active'
    });

    // If session exists, update it
    if (chatSession) {
      chatSession.userName = userName;
      chatSession.lastActivity = Date.now();
      if (studentId) chatSession.studentId = studentId;
      
      await chatSession.save();
      
      return res.json(chatSession);
    }

    // Create a new chat session
    chatSession = new ChatSession({
      instituteId,
      userName,
      userEmail,
      studentId: studentId || null,
      collegeName,
      messages: [] // Start with empty messages
    });

    // Save the chat session
    await chatSession.save();

    // Create a welcome message
    const welcomeMessage = {
      sender: 'institute',
      text: `Hello ${userName}, welcome to ${collegeName} chat support! How can we assist you today?`,
      timestamp: Date.now()
    };
    
    chatSession.messages.push(welcomeMessage);
    await chatSession.save();

    res.json(chatSession);
  } catch (err) {
    console.error('Error initializing chat:', err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST api/chat/message
 * @desc    Add a message to an existing chat session
 * @access  Public (for students/visitors)
 */
router.post('/message', [
  check('instituteId', 'Institute ID is required').not().isEmpty(),
  check('userName', 'Name is required').not().isEmpty(),
  check('userEmail', 'Please include a valid email').isEmail(),
  check('message', 'Message is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { instituteId, userName, userEmail, studentId, message, collegeName } = req.body;
    
    // Validate instituteId is a valid ObjectId
    if (!validateObjectId(instituteId)) {
      return res.status(400).json({ msg: 'Invalid institute ID format' });
    }

    // Find the chat session or create a new one if it doesn't exist
    let chatSession = await ChatSession.findOne({
      instituteId,
      userEmail,
      status: 'active'
    });

    if (!chatSession) {
      // Create a new session if none exists
      chatSession = new ChatSession({
        instituteId,
        userName,
        userEmail,
        studentId: studentId || null,
        collegeName,
        messages: []
      });
    }

    // Add the new message
    chatSession.messages.push({
      sender: 'user',
      text: message,
      timestamp: Date.now()
    });
    
    // Update last activity
    chatSession.lastActivity = Date.now();
    
    await chatSession.save();

    // Simulate an automated response (to be replaced with real staff responses)
    setTimeout(async () => {
      const autoResponse = getAutomaticResponse(message, collegeName);
      
      chatSession.messages.push({
        sender: 'institute',
        text: autoResponse,
        timestamp: Date.now()
      });
      
      await chatSession.save();
    }, 1000);

    res.json(chatSession);
  } catch (err) {
    console.error('Error sending message:', err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/chat/sessions/:instituteId
 * @desc    Get all chat sessions for an institute
 * @access  Private (Institute staff only)
 */
router.get('/sessions/:instituteId', auth, async (req, res) => {
  try {
    // Verify the user is authorized to access this institute's chats
    // This assumes your auth middleware adds user to req
    const institute = await Institute.findById(req.params.instituteId);
    if (!institute) {
      return res.status(404).json({ msg: 'Institute not found' });
    }

    // Check if the user is associated with this institute
    // This will depend on your authentication/authorization structure
    if (institute.adminId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to view these chats' });
    }

    // Get all chat sessions for this institute, sorted by lastActivity
    const chatSessions = await ChatSession.find({
      instituteId: req.params.instituteId
    })
    .sort({ lastActivity: -1 })
    .limit(50); // Limit to recent 50 sessions
    
    res.json(chatSessions);
  } catch (err) {
    console.error('Error fetching chat sessions:', err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/chat/session/:sessionId
 * @desc    Get a specific chat session
 * @access  Private (Institute staff & the student)
 */
router.get('/session/:sessionId', auth, async (req, res) => {
  try {
    const chatSession = await ChatSession.findById(req.params.sessionId);
    
    if (!chatSession) {
      return res.status(404).json({ msg: 'Chat session not found' });
    }

    // Authorization check - either the student or the institute staff can view
    const isStudent = chatSession.studentId && chatSession.studentId.toString() === req.user.id;
    const isInstitute = req.user.role === 'institute' && chatSession.instituteId.toString() === req.user.instituteId;
    
    if (!isStudent && !isInstitute) {
      return res.status(401).json({ msg: 'Not authorized to view this chat' });
    }

    // If institute staff is viewing, mark user messages as read
    if (isInstitute) {
      await chatSession.markAllAsRead();
    }

    res.json(chatSession);
  } catch (err) {
    console.error('Error fetching chat session:', err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/chat/student/:studentId
 * @desc    Get all chat sessions for a student
 * @access  Private (Student only)
 */
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    // Verify the user is authorized to access these chats
    if (req.user.id !== req.params.studentId) {
      return res.status(401).json({ msg: 'Not authorized to view these chats' });
    }

    // Get all chat sessions for this student
    const chatSessions = await ChatSession.find({
      studentId: req.params.studentId
    })
    .sort({ lastActivity: -1 });
    
    res.json(chatSessions);
  } catch (err) {
    console.error('Error fetching student chat sessions:', err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST api/chat/institute/reply/:sessionId
 * @desc    Institute staff reply to a chat session
 * @access  Private (Institute staff only)
 */
router.post('/institute/reply/:sessionId', [
  auth,
  check('message', 'Message is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const chatSession = await ChatSession.findById(req.params.sessionId);
    
    if (!chatSession) {
      return res.status(404).json({ msg: 'Chat session not found' });
    }

    // Verify the user is authorized to reply to this chat
    const institute = await Institute.findById(chatSession.instituteId);
    if (!institute || institute.adminId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to reply to this chat' });
    }

    // Add the institute's reply
    chatSession.messages.push({
      sender: 'institute',
      text: req.body.message,
      timestamp: Date.now()
    });
    
    // Update last activity
    chatSession.lastActivity = Date.now();
    
    await chatSession.save();
    
    res.json(chatSession);
  } catch (err) {
    console.error('Error sending institute reply:', err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   PUT api/chat/close/:sessionId
 * @desc    Close a chat session
 * @access  Private (Institute staff only)
 */
router.put('/close/:sessionId', auth, async (req, res) => {
  try {
    const chatSession = await ChatSession.findById(req.params.sessionId);
    
    if (!chatSession) {
      return res.status(404).json({ msg: 'Chat session not found' });
    }

    // Verify the user is authorized to close this chat
    const institute = await Institute.findById(chatSession.instituteId);
    if (!institute || institute.adminId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to close this chat' });
    }

    // Close the chat session
    chatSession.status = 'closed';
    await chatSession.save();
    
    res.json({ msg: 'Chat session closed', chatSession });
  } catch (err) {
    console.error('Error closing chat session:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;