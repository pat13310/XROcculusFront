import React, { useState } from 'react';
import { UserList } from '../components/users/UserList';
import { UserStats } from '../components/users/UserStats';
import { AddUserModal } from '../components/users/AddUserModal';
import { useUsers } from '../hooks/useUsers';
import { LoadingScreen } from '../components/LoadingScreen';
import { ErrorScreen } from '../components/ErrorScreen';
import { useTranslation } from '../contexts/TranslationContext';
import GradientHeader from '../components/GradientHeader';
import { Users2 } from 'lucide-react';

export function UsersPage() {
  const { users, stats, loading, refreshUsers } = useUsers();
  const [showAddModal, setShowAddModal] = useState(false);
  const { t } = useTranslation();

  if (loading) {
    return <LoadingScreen message={t('users.loading', 'Chargement des utilisateurs...')} />;
  }

  if (!users.length) {
    return <ErrorScreen message={t('users.no_users', 'Aucun utilisateur trouvé')} />;
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec dégradé */}
      <GradientHeader
        titleKey="users.title"
        defaultTitle="Utilisateurs"
        Icon={Users2}
      />
      <div className="flex justify-between items-center">
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 flex items-center"
        >
          {t('users.add_user', 'Ajouter')}
        </button>
      </div>
      
      <UserStats stats={stats} />
      <UserList users={users} />

      <AddUserModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUserAdded={refreshUsers}
      />
    </div>
  );
}