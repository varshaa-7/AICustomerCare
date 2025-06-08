import { makeAutoObservable } from 'mobx';
import axios from 'axios';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  sessionId: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
}

class ChatStore {
  messages: Message[] = [];
  conversations: Conversation[] = [];
  currentSessionId: string = '';
  isLoading: boolean = false;
  isTyping: boolean = false;
  error: string | null = null;
  
  private apiUrl = 'https://ai-backend-0ki0.onrender.com/api';

  constructor() {
    makeAutoObservable(this);
    this.initializeSession();
  }

  initializeSession() {
    this.currentSessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  async sendMessage(content: string, userId: string) {
    if (!content.trim() || this.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.isLoading = true;
    this.isTyping = true;
    this.error = null;

    try {
      const response = await axios.post(`${this.apiUrl}/chat`, {
        message: content.trim(),
        userId,
        sessionId: this.currentSessionId
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(response.data.timestamp)
      };

      this.messages.push(assistantMessage);
    } catch (error: any) {
      console.error('Error sending message:', error);
      this.error = error.response?.data?.error || 'Failed to send message';
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your message. Please try again.',
        timestamp: new Date()
      };
      this.messages.push(errorMessage);
    } finally {
      this.isLoading = false;
      this.isTyping = false;
    }
  }

  // async loadChatHistory(userId: string) {
  //   try {
  //     const response = await axios.get(`${this.apiUrl}/chat/history/${userId}`);
  //     this.conversations = response.data.map((conv: any) => ({
  //       id: conv._id,
  //       sessionId: conv.sessionId,
  //       title: conv.title,
  //       messages: conv.messages.map((msg: any) => ({
  //         id: msg._id,
  //         role: msg.role,
  //         content: msg.content,
  //         timestamp: new Date(msg.timestamp)
  //       })),
  //       updatedAt: new Date(conv.updatedAt)
  //     }));
  //   } catch (error) {
  //     console.error('Error loading chat history:', error);
  //   }
  // }
  async loadChatHistory(userId: string) {
  try {
    const response = await axios.get(`${this.apiUrl}/chat/history/${userId}`);
    const history = response.data;

    this.conversations = history.map((conv: any) => ({
      id: conv._id,
      sessionId: conv.sessionId,
      title: conv.title,
      messages: [], // we don't load messages here, only metadata
      updatedAt: new Date(conv.updatedAt)
    }));

    // If at least one conversation exists, load the latest one
    if (history.length > 0) {
      const latestSessionId = history[0].sessionId;
      await this.loadConversation(latestSessionId, userId); // 👈 load only this one
    } else {
      this.startNewConversation(); // new session if no previous conv
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
}


  async loadConversation(sessionId: string, userId: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/chat/conversation/${sessionId}`, {
        params: { userId }
      });
      
      const conversation = response.data;
      this.messages = conversation.messages.map((msg: any) => ({
        id: msg._id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      }));
      
      this.currentSessionId = sessionId;
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  }

  startNewConversation() {
    this.messages = [];
    this.initializeSession();
    this.error = null;
  }

  clearError() {
    this.error = null;
  }
}

export const chatStore = new ChatStore();