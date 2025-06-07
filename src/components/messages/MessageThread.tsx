'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface User {
  id: string;
  name?: string | null;
  image?: string | null;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: User;
}

export default function MessageThread({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when conversation ID changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/messages/${conversationId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await response.json();
        setMessages(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Set up polling for new messages
    const intervalId = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !conversationId || !session?.user?.id) return;
    
    try {
      setSending(true);
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Clear the input
      setNewMessage('');
      
      // Refresh messages
      const messagesResponse = await fetch(`/api/messages/${conversationId}`);
      if (messagesResponse.ok) {
        const data = await messagesResponse.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Format timestamp
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for date separators
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    let currentGroup: Message[] = [];
    
    messages.forEach(message => {
      const messageDate = new Date(message.createdAt).toDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: [...currentGroup]
          });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        messages: currentGroup
      });
    }
    
    return groups;
  };

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
        <p className="text-lg font-medium">Select a conversation to start messaging</p>
      </div>
    );
  }

  if (loading && messages.length === 0) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-md">
            <div className="flex items-end">
              <div className="h-8 w-8 rounded-full bg-gray-200 mr-2"></div>
              <div className="h-16 bg-gray-200 rounded-lg w-2/3"></div>
            </div>
            <div className="flex items-end justify-end">
              <div className="h-16 bg-gray-200 rounded-lg w-2/3"></div>
            </div>
            <div className="flex items-end">
              <div className="h-8 w-8 rounded-full bg-gray-200 mr-2"></div>
              <div className="h-16 bg-gray-200 rounded-lg w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 flex items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messageGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start the conversation by sending a message</p>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-500">
                  {formatDate(new Date(group.date).toISOString())}
                </div>
              </div>
              
              {group.messages.map((message, index) => {
                const isCurrentUser = message.senderId === session?.user?.id;
                const showAvatar = index === 0 || 
                  group.messages[index - 1].senderId !== message.senderId;
                
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    {!isCurrentUser && showAvatar && (
                      <div className="flex-shrink-0 mr-2">
                        {message.sender.image ? (
                          <img 
                            src={message.sender.image} 
                            alt={message.sender.name || 'User'} 
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                            {message.sender.name ? message.sender.name.charAt(0).toUpperCase() : '?'}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] ${!isCurrentUser && !showAvatar ? 'ml-10' : ''}`}>
                      {!isCurrentUser && showAvatar && (
                        <div className="text-xs text-gray-500 mb-1 ml-1">
                          {message.sender.name || 'Unknown User'}
                        </div>
                      )}
                      
                      <div className="flex items-end">
                        <div 
                          className={`px-4 py-2 rounded-lg ${
                            isCurrentUser 
                              ? 'bg-blue-500 text-white rounded-br-none' 
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          {message.content}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatMessageTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="border-t p-4" style={{ borderColor: 'var(--secondary)' }}>
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-r-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={!newMessage.trim() || sending}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

