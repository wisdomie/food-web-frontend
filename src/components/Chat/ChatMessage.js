/**
 * ChatMessage Component
 *
 * Displays a single message in the chat interface
 */

import React from 'react';

function ChatMessage({ message, isTyping = false }) {
  const { role, content, created_at } = message;
  const isUser = role === 'user';

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render typing indicator
  if (isTyping) {
    return (
      <div className="chat-message assistant">
        <div className="message-avatar">
          <span className="avatar-icon">AI</span>
        </div>
        <div className="message-content">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  // Simple markdown-like formatting
  const formatContent = (text) => {
    if (!text) return '';

    // Convert **bold** to <strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert bullet points
    text = text.replace(/^[•\-\*]\s/gm, '<br/>• ');

    // Convert numbered lists
    text = text.replace(/^\d+\.\s/gm, (match) => '<br/>' + match);

    // Convert line breaks
    text = text.replace(/\n/g, '<br/>');

    return text;
  };

  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? (
          <span className="avatar-icon user-icon">You</span>
        ) : (
          <span className="avatar-icon">AI</span>
        )}
      </div>
      <div className="message-bubble">
        <div
          className="message-content"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
        {created_at && (
          <div className="message-time">
            {formatTime(created_at)}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
