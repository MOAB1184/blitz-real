'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChatBubbleLeftRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name?: string | null;
  image?: string | null;
  email?: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
}

interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message | null;
  hasUnread: boolean;
  updatedAt: string;
}

export default function ConversationList({ selectedId, onSelect }: { selectedId?: string, onSelect: (id: string) => void }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/messages/conversations');
        
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        
        const data = await response.json();
        setConversations(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    
    // Set up polling for new messages
    const intervalId = setInterval(fetchConversations, 10000); // Poll every 10 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const filteredConversations = conversations.filter(conversation => {
    if (!searchTerm.trim()) return true;
    
    // Search by participant name or email
    return conversation.participants.some(participant => 
      participant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffInDays < 7) {
      // Within a week - show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Function to get the other participant's name
  const getParticipantName = (conversation: Conversation) => {
    const participant = conversation.participants[0];
    return participant?.name || 'Unknown User';
  };

  // Function to get the message preview
  const getMessagePreview = (conversation: Conversation) => {
    if (!conversation.lastMessage) return 'No messages yet';
    
    const isSender = conversation.lastMessage.senderId === session?.user?.id;
    const prefix = isSender ? 'You: ' : '';
    
    return `${prefix}${conversation.lastMessage.content.substring(0, 30)}${conversation.lastMessage.content.length > 30 ? '...' : ''}`;
  };

  // Function to render the avatar
  const renderAvatar = (conversation: Conversation) => {
    const participant = conversation.participants[0];
    
    if (participant?.image) {
      return (
        <img 
          src={participant.image} 
          alt={participant.name || 'User'} 
          className="h-12 w-12 rounded-full object-cover"
        />
      );
    }
    
    // Default avatar with initials
    const initials = participant?.name 
      ? participant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
      : '?';
      
    return (
      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
        {initials}
      </div>
    );
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex space-x-4 w-full">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-center h-full text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r" style={{ borderColor: 'var(--secondary)' }}>
      <div className="p-4 border-b" style={{ borderColor: 'var(--secondary)' }}>
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mb-2" />
            <p className="text-lg font-medium">No conversations yet</p>
            <p className="text-sm">Start messaging with sponsors and creators</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedId === conversation.id ? 'bg-gray-100' : ''
              }`}
              style={{ borderColor: 'var(--secondary)' }}
              onClick={() => onSelect(conversation.id)}
            >
              <div className="flex-shrink-0 mr-4">
                {renderAvatar(conversation)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-medium truncate">
                    {getParticipantName(conversation)}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatDate(conversation.lastMessage?.createdAt || conversation.updatedAt)}
                  </span>
                </div>
                <p className={`text-sm truncate ${conversation.hasUnread ? 'font-semibold' : 'text-gray-500'}`}>
                  {getMessagePreview(conversation)}
                </p>
              </div>
              {conversation.hasUnread && (
                <div className="ml-2 h-2.5 w-2.5 rounded-full bg-blue-600"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

