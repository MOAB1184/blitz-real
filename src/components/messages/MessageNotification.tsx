'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon } from '@heroicons/react/24/outline';

interface UnreadCountResponse {
  unreadCount: number;
}

export default function MessageNotification() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/messages/unread');
        
        if (!response.ok) {
          throw new Error('Failed to fetch unread messages');
        }
        
        const data = await response.json() as UnreadCountResponse;
        setUnreadCount(data.unreadCount ?? 0);
      } catch (err) {
        console.error('Error fetching unread messages:', err);
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();
    
    // Set up polling for unread messages
    const intervalId = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const handleClick = () => {
    router.push('/dashboard/messages');
  };

  return (
    <button
      onClick={handleClick}
      className="relative rounded-full p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      <span className="sr-only">View messages</span>
      <BellIcon className="h-6 w-6" aria-hidden="true" />
      
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

