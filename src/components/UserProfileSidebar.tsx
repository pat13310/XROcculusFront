import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function UserProfileSidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center space-x-2 ">
      <div className="flex-shrink-0">
        <div className="bg-gray-800 p-1 rounded-full">
          <User className="h-4 w-4 text-gray-300" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm text-gray-300">
          {user.email || 'demo2@example.com'}
        </div>
      </div>
    </div>
  );
}
