import React from 'react';
import { User, Mail, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function UserProfileSidebar() {
  const { user } = useAuth();

  // Formater la date de dernière connexion
  const formatLastLogin = (lastLoginDate?: string) => {
    if (!lastLoginDate) return 'Jamais connecté';
    
    const date = new Date(lastLoginDate);
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Traduire le rôle
  const translateRole = (role: string) => {
    switch(role) {
      case 'admin': return 'Administrateur';
      case 'user': return 'Utilisateur';
      default: return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  // Définir la couleur du badge en fonction du rôle
  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-violet-100 text-violet-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg p-6 mb-4">
      <div className="flex items-center space-x-4 mb-4 rounded-t-lg">
        <div className="bg-violet-100 p-3 rounded-full">
          <User className="h-6 w-6 text-violet-600" />
        </div>
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-800">{user.username}</h3>
          <span 
            className={`
              ${getRoleBadgeColor(user.role)} 
              text-xs font-medium px-2.5 py-0.5 rounded-full
            `}
          >
            {user.role === 'admin' || user.role === 'user' 
              ? translateRole(user.role) 
              : user.role}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">{user.email || 'E-mail non disponible'}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            Connexion : {formatLastLogin(user.lastLoginAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
