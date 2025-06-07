
# AI Customer Support Chat Platform

A full-stack AI-powered customer support chat application built with React, Node.js, MongoDB, and OpenAI API.

## Features

### Frontend (React + MobX)
- **Clean, responsive chat interface** - Works seamlessly on desktop and mobile
- **Real-time messaging** - Instant communication with AI assistant
- **Typing indicators** - Visual feedback during AI response generation
- **Message history** - Persistent conversation storage
- **Modern UI/UX** - Glass-morphism effects and smooth animations
- **Authentication** - Login, registration, and demo mode

### Backend (Node.js + Express)
- **RESTful API** - Clean endpoints for chat and user management
- **OpenAI Integration** - GPT-3.5-turbo for intelligent responses
- **MongoDB Storage** - Persistent conversation and user data
- **FAQ System** - Upload and process FAQ documents (PDF/TXT)
- **JWT Authentication** - Secure user sessions
- **Error Handling** - Comprehensive error management

### AI Features
- **Context Awareness** - Maintains conversation context
- **Customer Support Persona** - Professional, helpful responses
- **FAQ Integration** - Matches user queries with uploaded FAQs
- **Fallback Handling** - Graceful error recovery

## Tech Stack

- **Frontend**: React 18, TypeScript, MobX, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Authentication**: JWT, bcryptjs
- **File Processing**: PDF parsing for FAQ uploads
- **Development**: Vite, ESLint, Nodemon

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   cd server && npm install
   cd ..
   ```

2. **Environment Setup**
   ```bash
   cd server
   cp .env.example .env
   ```

   Edit `server/.env` with your configuration:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   MONGODB_URI=mongodb://localhost:27017/ai-chat-support
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas cloud service

4. **Run the application**
   ```bash
   # Start both frontend and backend
   npm run dev:full

   # Or start individually:
   # Frontend: npm run dev
   # Backend: npm run server
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/demo` - Demo login (no registration)

### Chat
- `POST /api/chat` - Send message and get AI response
- `GET /api/chat/history/:userId` - Get user's chat history
- `GET /api/chat/conversation/:sessionId` - Get specific conversation

### Admin (FAQ Management)
- `POST /api/admin/upload-faqs` - Upload FAQ documents
- `GET /api/admin/faqs` - Get all FAQs
- `POST /api/admin/faqs` - Add single FAQ
- For login the credentials are -> Email -> admin@example.com Password -> admin123
  

## Usage

### For Users
1. **Login or Register** - Create an account or use demo mode
2. **Start Chatting** - Type your questions in the chat interface
3. **Get AI Responses** - Receive instant, context-aware answers
4. **View History** - Access previous conversations
5. **New Conversations** - Start fresh topics anytime

### For Admins
1. **Upload FAQ Documents** - Use the admin interface to upload PDF or text files
2. **Manage FAQs** - Add, edit, and organize frequently asked questions
3. **Monitor Usage** - Track conversation history and user engagement

## FAQ Document Format

When uploading FAQ files, use this format:

```
Q: How do I reset my password?
A: You can reset your password by clicking the "Forgot Password" link on the login page.

Q: What are your business hours?
A: We are open Monday-Friday, 9 AM to 6 PM EST.

Question: How do I contact support?
Answer: You can reach our support team at support@company.com or through this chat.
```

## Development

### Project Structure
```
/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── stores/            # MobX stores
│   └── ...
├── server/                # Backend Node.js app
│   ├── models/            # MongoDB models
│   ├── routes/            # Express routes
│   └── ...
└── ...
```

### Key Files
- `src/stores/ChatStore.ts` - Chat state management
- `src/stores/AuthStore.ts` - Authentication state
- `server/routes/chat.js` - Chat API endpoints
- `server/models/Conversation.js` - Chat data model

## Environment Variables

Create `server/.env` with these variables:

```env
# Required
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=mongodb://localhost:27017/ai-chat-support
JWT_SECRET=your_secure_jwt_secret

# Optional
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section below
2. Open an issue on GitHub
3. Contact the development team

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Ensure MongoDB is running locally or check your cloud connection string
- Verify the MONGODB_URI in your .env file

**OpenAI API Errors**
- Check your API key is valid and has credits
- Ensure OPENAI_API_KEY is correctly set in .env

**CORS Issues**
- Verify FRONTEND_URL matches your frontend development server
- Check that both frontend and backend are running

**Authentication Issues**
- Clear browser localStorage and try again
- Verify JWT_SECRET is set in .env

### Performance Tips
- Keep conversation history reasonable (automatically limited to last 10 messages for context)
- Monitor OpenAI usage to avoid unexpected costs
- Consider implementing rate limiting for production use

## Admin Interface for FAQ Management

🔑 Admin Login Credentials  
A default admin user is automatically created when the server starts:  
Email: admin@example.com  
Password: admin123  

🎯 Admin Features  
1. Admin Panel Access  
Admin users see a navigation toggle in the top-right corner to switch between Chat and Admin views  
Non-admin users are blocked from accessing the admin panel  

2. FAQ Management  
- View all FAQs with search and category filtering  
- Add new FAQs manually with form validation  
- Upload FAQ documents (PDF or text files) with automatic parsing  
- Edit existing FAQs (update functionality added)  
- Delete FAQs with confirmation  
- Category management and priority settings  

3. File Upload Support  
- Upload PDF or text files containing FAQs  
- Automatic parsing of Q: and A: format  
- Keyword extraction for better search matching  
- Bulk FAQ creation from documents  

4. Enhanced Admin Routes  
- PUT /api/admin/faqs/:id - Update FAQ  
- DELETE /api/admin/faqs/:id - Delete FAQ  
- Enhanced search and filtering capabilities  

🚀 How to Use  
- Start the application (already running)  
- Login as admin using the credentials above  
- Click "Admin" in the top-right navigation to access the admin panel  
- Add FAQs manually or upload documents  
- Manage existing FAQs with edit/delete options  

📄 FAQ Document Format  
When uploading files, use this format:  

```
Q: How do I reset my password?  
A: You can reset your password by clicking the "Forgot Password" link.  

Q: What are your business hours?  
A: We are open Monday-Friday, 9 AM to 6 PM EST.  
```

The admin panel provides a beautiful, production-ready interface for managing your AI assistant's knowledge base. All FAQs added here will be automatically used by the AI to provide better, more accurate responses to users!
