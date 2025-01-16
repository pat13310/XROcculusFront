import {
  Home,
  Smartphone,
  Box,
  Users,
  Settings,
  Activity,
  FileText,
  Wand2,
  User,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../contexts/TranslationContext';
import { createLogger } from '../utils/logger';
import { UserProfileSidebar } from './UserProfileSidebar';

const logger = createLogger('Sidebar');

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  deviceCount: number;
}

export function Sidebar({
  isOpen,
  onClose,
  deviceCount,
}: SidebarProps) {
  const { t } = useTranslation();

  const menuItems = [
    {
      icon: Home,
      label: t('sidebar.dashboard', 'Tableau de bord'),
      to: '/dashboard',
    },
    {
      icon: Smartphone,
      label: t('sidebar.devices', 'Appareils'),
      to: '/devices',
      count: deviceCount,
    },
    {
      icon: Box,
      label: t('sidebar.applications', 'Applications'),
      to: '/applications',
    },
    {
      icon: Users,
      label: t('sidebar.users', 'Utilisateurs'),
      to: '/users',
    },
    {
      icon: User,
      label: t('sidebar.profile', 'Profil'),
      to: '/profile',
    },
    {
      icon: FileText,
      label: t('sidebar.reports', 'Rapports'),
      to: '/reports',
    },
    {
      icon: Wand2,
      label: t('sidebar.assistant', 'Assistant'),
      to: '/assistant',
    },
    {
      icon: Settings,
      label: t('sidebar.settings', 'Paramètres'),
      to: '/settings',
    },
  ];

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-lg 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          <button 
            onClick={onClose} 
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Profil utilisateur en haut de la sidebar */}
          <UserProfileSidebar />

          <nav className="space-y-1 px-2 py-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-violet-100 text-violet-900'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                {item.label}
                {item.count !== undefined && (
                  <span className="ml-2 bg-violet-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}