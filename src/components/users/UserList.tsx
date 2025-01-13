import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { UserRow } from './UserRow';
import { useTranslation } from '../../contexts/TranslationContext';
import type { User } from '../../types/users';

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: 'user', label: t('users.columns.user', 'Utilisateur') },
    { key: 'role', label: t('users.columns.role', 'Rôle') },
    { key: 'status', label: t('users.columns.status', 'Statut') },
    { key: 'lastActive', label: t('users.columns.last_active', 'Dernière activité') }, // TODO: Translate Active') }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('users.search_placeholder', 'Rechercher utilisateurs...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
              <th className="relative px-6 py-3">
                <span className="sr-only">{t('users.columns.actions', 'Actions')}</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}