import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';
import axios from 'axios';

const ChatPage = ({ user }) => {
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load chat history when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('/api/chat/message/recent');
        if (response.data && response.data.length > 0) {
          setChatHistory(response.data[0].messages || []);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setError('Failed to load chat history');
      }
    };

    if (user) {
      fetchChatHistory();
    }
  }, [user]);

  const handleSendMessage = async (message, response) => {
    if (response.error) {
      // Add error message to chat history
      setChatHistory(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: response.error,
        timestamp: new Date(),
        isError: true
      }]);
      return;
    }

    // Add user message to chat history
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
      timestamp: new Date()
    };

    // Add bot response to chat history
    const botMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      text: response.aiResponse.response,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage, botMessage]);
  };

  if (!user) {
    navigate('/login', { state: { from: '/chat' } });
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <ChatInterface
          chatHistory={chatHistory}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          user={user}
        />
      </div>
    </div>
  );
};

export default ChatPage; 