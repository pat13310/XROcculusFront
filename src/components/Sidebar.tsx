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
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg 
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
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center p-2 rounded-lg 
                    ${isActive 
                      ? 'bg-violet-100 text-violet-800' 
                      : 'text-gray-600 hover:bg-gray-100'}
                    transition-colors duration-200
                  `}
                  onClick={onClose}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="flex-1">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="bg-violet-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}