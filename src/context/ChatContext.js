/**
 * Chat Context
 *
 * Manages chat state for the Diet Advisor conversation
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { sendChatMessage, getConversations, getConversation } from '../services/api';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Load conversation list
  const loadConversations = useCallback(async () => {
    try {
      const response = await getConversations();
      if (response.success) {
        setConversations(response.conversations);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  }, []);

  // Load a specific conversation
  const loadConversation = useCallback(async (conversationId) => {
    try {
      const response = await getConversation(conversationId);
      if (response.success) {
        setCurrentConversation(response.conversation);
        setMessages(response.conversation.messages || []);
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setError('Failed to load conversation');
    }
  }, []);

  // Start a new conversation
  const startNewConversation = useCallback(() => {
    setCurrentConversation(null);
    setMessages([]);
    setError(null);
  }, []);

  // Send a message
  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim()) return;

    setError(null);

    // Add user message to UI immediately
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    try {
      const response = await sendChatMessage(
        messageText,
        currentConversation?.id
      );

      if (response.success) {
        // Add assistant response
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.response,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, assistantMessage]);

        // Update current conversation ID if new
        if (!currentConversation && response.conversation_id) {
          setCurrentConversation({ id: response.conversation_id });
          // Refresh conversation list
          loadConversations();
        }
      } else {
        setError(response.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  }, [currentConversation, loadConversations]);

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId) => {
    try {
      const api = (await import('../services/api')).default;
      await api.delete(`/conversations/${conversationId}`);

      // Remove from list
      setConversations(prev =>
        prev.filter(c => c.id !== conversationId)
      );

      // Clear if it was the current conversation
      if (currentConversation?.id === conversationId) {
        startNewConversation();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  }, [currentConversation, startNewConversation]);

  const value = {
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
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
