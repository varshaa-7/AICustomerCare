import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import Conversation from '../models/Conversation.js';
import FAQ from '../models/FAQ.js';
dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompt for customer support
const SYSTEM_PROMPT = `You are a helpful and professional customer support assistant. 
- Be friendly, empathetic, and solution-oriented
- Provide clear and concise answers
- If you don't know something, admit it and offer to connect the user with a human agent
- Always maintain a professional tone while being approachable
- Focus on resolving customer issues efficiently`;

// Send a message and get AI response
router.post('/', async (req, res) => {
  try {
    const { message, userId, sessionId } = req.body;

    if (!message || !userId || !sessionId) {
      return res.status(400).json({ error: 'Message, userId, and sessionId are required' });
    }

    // Get or create conversation
    let conversation = await Conversation.findOne({ userId, sessionId });
    
    if (!conversation) {
      conversation = new Conversation({
        userId,
        sessionId,
        messages: []
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Check for FAQ matches first
    const faqMatch = await findRelevantFAQ(message);
    
    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(faqMatch ? [{ role: 'system', content: `Relevant FAQ: Q: ${faqMatch.question} A: ${faqMatch.answer}` }] : []),
      ...conversation.messages.slice(-10).map(msg => ({ // Keep last 10 messages for context
        role: msg.role,
        content: msg.content
      }))
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Add AI response to conversation
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    // Generate title for new conversations
    if (conversation.messages.length === 2) {
      conversation.title = message.length > 50 ? message.substring(0, 50) + '...' : message;
    }

    await conversation.save();

    res.json({
      response: aiResponse,
      conversationId: conversation._id,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get chat history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('sessionId title messages updatedAt createdAt');

    res.json(conversations);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Get specific conversation
router.get('/conversation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.query;

    const conversation = await Conversation.findOne({ sessionId, userId });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Conversation fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Helper function to find relevant FAQ
async function findRelevantFAQ(message) {
  try {
    const faqs = await FAQ.find({ isActive: true })
      .sort({ priority: -1 })
      .limit(10);

    // Simple keyword matching
    const messageLower = message.toLowerCase();
    
    for (const faq of faqs) {
      const questionLower = faq.question.toLowerCase();
      const keywords = faq.keywords.map(k => k.toLowerCase());
      
      // Check if message contains FAQ keywords or similar question words
      if (keywords.some(keyword => messageLower.includes(keyword)) ||
          messageLower.includes(questionLower) ||
          questionLower.includes(messageLower)) {
        return faq;
      }
    }
    
    return null;
  } catch (error) {
    console.error('FAQ search error:', error);
    return null;
  }
}

export default router;