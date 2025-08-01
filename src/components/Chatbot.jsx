import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChatBubbleLeftEllipsisIcon, 
  XMarkIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";
import api from "../api";

const TypingIndicator = () => (
  <div className="flex space-x-1 items-center">
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

const Message = ({ message, isBot }) => {
  const variants = {
    hidden: { opacity: 0, y: isBot ? 20 : -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={`flex ${isBot ? "justify-start" : "justify-end"} mb-3`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isBot
            ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none"
            : "bg-blue-600 text-white rounded-tr-none"
        }`}
      >
        {message.text}
        {message.timestamp && (
          <div className={`text-xs mt-1 ${isBot ? "text-gray-500 dark:text-gray-400" : "text-blue-200"}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "What books do you recommend?",
    "How do I renew a book?",
    "What are the library hours?",
    "Where can I find research papers?"
  ]);
  const messagesEndRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedChat = localStorage.getItem('libraryChatHistory');
    if (savedChat) {
      setChatHistory(JSON.parse(savedChat));
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('libraryChatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const sendQuestion = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      from: "user", 
      text: input.trim(),
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const res = await api.post("/chatbot", { question: userMessage.text });
      const botMessage = { 
        from: "bot", 
        text: res.data.answer,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        { 
          from: "bot", 
          text: "I'm having trouble connecting right now. Please try again later.",
          timestamp: new Date()
        },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    localStorage.removeItem('libraryChatHistory');
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle chat"
      >
        <div className="relative">
          {!isOpen ? (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-xl flex items-center justify-center">
              <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-full shadow-xl">
              <XMarkIcon className="w-6 h-6" />
            </div>
          )}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-5 h-5" />
                <h2 className="font-semibold text-lg">Library AI Assistant</h2>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={clearChat}
                  className="p-1 rounded-full hover:bg-blue-700 transition"
                  title="Clear chat"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-blue-700 transition"
                  title="Close chat"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <SparklesIcon className="w-10 h-10 text-blue-500 mb-3" />
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">How can I help you today?</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Ask me anything about books, research, or library services</p>
                  
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(suggestion)}
                        className="text-left p-3 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {chatHistory.map((msg, i) => (
                    <Message 
                      key={i} 
                      message={msg} 
                      isBot={msg.from === "bot"} 
                    />
                  ))}
                  {isTyping && (
                    <div className="flex mb-3">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 rounded-tl-none">
                        <TypingIndicator />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  sendQuestion();
                }}
                className="flex items-end gap-2"
              >
                <div className="flex-1 relative">
                  <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="w-full resize-none rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                    disabled={loading}
                  />
                  {input && (
                    <button
                      type="button"
                      onClick={() => setInput("")}
                      className="absolute right-10 bottom-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={`p-3 rounded-full ${input.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'} transition`}
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Library AI may produce inaccurate information
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}