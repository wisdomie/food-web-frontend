/**
 * ChatInterface Component
 *
 * Main chat interface for the Diet Advisor
 */

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import ChatMessage from './ChatMessage';

function ChatInterface() {
  const {
    conversations,
    currentConversation,
    messages,
    isTyping,
    error,
    loadConversations,
    loadConversation,
    startNewConversation,
    sendMessage,
    deleteConversation
  } = useChat();

  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleConversationClick = (conv) => {
    loadConversation(conv.id);
  };

  const handleDeleteConversation = (e, convId) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation?')) {
      deleteConversation(convId);
    }
  };

  // Suggested prompts for new conversations
  const suggestedPrompts = [
    "How am I doing this week?",
    "What should I eat for lunch?",
    "Suggest healthier alternatives for pizza",
    "Am I getting enough protein?"
  ];

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className={`chat-sidebar ${showSidebar ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Conversations</h3>
          <button
            className="btn-icon"
            onClick={startNewConversation}
            title="New conversation"
          >
            +
          </button>
        </div>

        <div className="conversation-list">
          {conversations.length === 0 ? (
            <p className="no-conversations">No conversations yet</p>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${
                  currentConversation?.id === conv.id ? 'active' : ''
                }`}
                onClick={() => handleConversationClick(conv)}
              >
                <div className="conversation-title">
                  {conv.title || 'New Conversation'}
                </div>
                <div className="conversation-meta">
                  {conv.message_count} messages
                </div>
                <button
                  className="btn-delete"
                  onClick={(e) => handleDeleteConversation(e, conv.id)}
                  title="Delete"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <button
            className="btn-icon sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            ☰
          </button>
          <h2>Diet Advisor</h2>
          <span className="header-subtitle">
            Your AI-powered nutrition assistant
          </span>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-welcome">
              <div className="welcome-icon">🥗</div>
              <h3>Welcome, {user?.username}!</h3>
              <p>
                I'm your personal Diet Advisor. I can help you track your
                nutrition, suggest healthier alternatives, and provide
                personalized dietary advice based on your goals.
              </p>
              <div className="suggested-prompts">
                <p className="prompts-label">Try asking:</p>
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="prompt-suggestion"
                    onClick={() => {
                      setInputText(prompt);
                      inputRef.current?.focus();
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <ChatMessage key={msg.id || index} message={msg} />
              ))}
              {isTyping && <ChatMessage isTyping={true} message={{}} />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="chat-error">
            {error}
          </div>
        )}

        {/* Input */}
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about your diet..."
            disabled={isTyping}
            rows={1}
          />
          <button
            type="submit"
            className="btn-send"
            disabled={!inputText.trim() || isTyping}
          >
            {isTyping ? '...' : '→'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatInterface;
