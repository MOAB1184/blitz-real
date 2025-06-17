'use client';

import { useState, useEffect } from 'react';
import ConversationList from '@/components/messages/ConversationList';
import MessageThread from '@/components/messages/MessageThread';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const { data: session } = useSession();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => { setFadeIn(true); }, []);

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
  };

  const handleSearchUsers = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      // Use real API call and filter by role
      const role = session?.user?.role === 'SPONSOR' ? 'CREATOR' : 'CREATOR';
      const res = await fetch(`/api/users/search?term=${encodeURIComponent(term)}&role=${role}`);
      if (res.ok) {
        const users = await res.json();
        setSearchResults(users);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (user: any) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantIds: selectedUsers.map(user => user.id),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }
      
      const data = await response.json();
      setSelectedConversation(data.id);
      setShowNewMessageModal(false);
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to create conversation. Please try again.');
    }
  };

  return (
    <div className={`transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: 'var(--secondary)' }}>
        <h1 className="text-2xl font-bold">Messages</h1>
        <button
          onClick={() => setShowNewMessageModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          New Message
        </button>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation list - 1/3 width on larger screens */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <ConversationList 
            selectedId={selectedConversation || undefined} 
            onSelect={handleSelectConversation} 
          />
        </div>
        
        {/* Message thread - 2/3 width on larger screens */}
        <div className="hidden md:block md:w-2/3 flex-1">
          {selectedConversation ? (
            <MessageThread conversationId={selectedConversation} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
              <p className="text-lg font-medium">Select a conversation to start messaging</p>
              <p className="text-sm">Or create a new message using the button above</p>
            </div>
          )}
        </div>
      </div>
      
      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">New Message</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To:
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedUsers.map(user => (
                  <div 
                    key={user.id}
                    className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center"
                  >
                    <span>{user.name}</span>
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="w-full px-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={handleSearchUsers}
              />
              
              {searchResults.length > 0 && (
                <div className="mt-2 border rounded-md max-h-40 overflow-y-auto">
                  {searchResults.map(user => (
                    <div
                      key={user.id}
                      className="p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNewMessageModal(false);
                  setSelectedUsers([]);
                  setSearchTerm('');
                  setSearchResults([]);
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateConversation}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={selectedUsers.length === 0}
              >
                Start Conversation
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

