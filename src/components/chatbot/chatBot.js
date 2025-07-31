import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChefHat, Loader2, Minimize2 } from 'lucide-react';

const ChatBot = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const welcomeMessage = {
    id: 'welcome',
    role: 'assistant',
    content: `Hello! 👋 I’m your AI Cooking Assistant. I can help you with:

🍳 Cooking recipe suggestions  
🥘 Ingredient substitutions  
⏰ Cooking and preparation time guidance  
🍽️ Meal ideas based on available ingredients  
📝 Answer questions about cooking techniques

What would you like to ask today?`,
    timestamp: new Date().toLocaleTimeString()
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const createCookingPrompt = (userMessage) => {
    return `You are a friendly and professional AI cooking assistant. Answer the following cooking-related question in Vietnamese in a detailed and helpful manner:

Question: ${userMessage}

Be enthusiastic and helpful in your response, and include:
- Step-by-step instructions if needed
- Tips and key notes
- Estimated preparation and cooking time (if relevant)
- Ingredient alternatives (if applicable)

Keep your answer concise but informative.`;
  };

  const sendMessage = async () => {
    if (!input.trim() || !apiKey) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const cookingPrompt = createCookingPrompt(input);
      console.log("api", apiKey)

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: cookingPrompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Unable to connect to AI assistant');
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0]) {
        const botMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.candidates[0].content.parts[0].text,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('No response received from AI');
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Sorry, I encountered a technical issue. Please try again. 😅\n\nError: ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const suggestedQuestions = [
    "How to make delicious beef pho at home?",
    "What can I use instead of butter in baking?",
    "Quick dish with rice and eggs?",
    "How to remove the fishy smell from fish?"
  ];

  const handleSuggestedQuestion = (question) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] text-white">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="w-16 h-16 bg-orange-600 hover:bg-orange-700 rounded-full shadow-lg transition-all flex items-center justify-center group hover:scale-110"
        >
          <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <ChefHat className="w-3 h-3 text-white" />
          </div>
        </button>
      )}

      {isOpen && (
        <div className={`w-105 bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 overflow-hidden transition-all duration-300 ${
          isMinimized ? 'h-26' : 'h-125'
        }`}>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ChefHat className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">AI Cooking Assistant</h3>
                  <p className="text-xs opacity-90">{isLoading ? 'Thinking...' : 'Ready to help'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={minimizeChat} className="p-1 hover:bg-white/10 rounded">
                  <Minimize2 className="w-4 h-4 text-white" />
                </button>
                <button onClick={toggleChat} className="p-1 hover:bg-white/10 rounded">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="h-91 overflow-y-auto p-4 space-y-3 bg-gray-800 hide-scrollbar">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                      message.role === 'user'
                        ? 'bg-orange-600 text-white rounded-br-md'
                        : message.isError
                        ? 'bg-red-800 text-red-100 border border-red-400 rounded-bl-md'
                        : 'bg-gray-700 text-white border border-gray-600 rounded-bl-md'
                    }`}>
                      <div>{formatMessage(message.content)}</div>
                      <div className="text-xs mt-1 opacity-70">
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-xs px-3 py-2 rounded-2xl bg-gray-700 text-white border border-gray-600">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                        <span className="text-sm">Generating response...</span>
                      </div>
                    </div>
                  </div>
                )}

                {messages.length === 1 && !isLoading && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 text-center">Try asking:</p>
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="w-full text-left p-2 bg-gray-700 hover:bg-orange-600 border border-gray-600 rounded-lg text-sm text-white transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 bg-gray-900 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about cooking..."
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-white placeholder-gray-400"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
