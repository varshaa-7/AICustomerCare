import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from './stores/AuthStore';
import AuthForm from './components/AuthForm';
import ChatInterface from './components/ChatInterface';
import AdminPanel from './components/AdminPanel';

const App = observer(() => {
  const [currentView, setCurrentView] = useState<'chat' | 'admin'>('chat');

  if (!authStore.isAuthenticated) {
    return <AuthForm />;
  }

  // Show admin panel if user is admin and admin view is selected
  if (authStore.user?.role === 'admin' && currentView === 'admin') {
    return <AdminPanel />;
  }

  return (
    <div className="App">
      {/* Navigation for admin users */}
      {authStore.user?.role === 'admin' && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('chat')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  currentView === 'chat'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  currentView === 'admin'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ChatInterface />
    </div>
  );
});

export default App;