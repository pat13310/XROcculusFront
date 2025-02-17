import React from 'react';
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
import type { Page } from '../hooks/useNavigation';
import type { Device } from '../types';

const logger = createLogger('Sidebar');

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  devices: Device[];
  loading: boolean;
  selectedDevice: string | null;
  onDeviceSelect: (deviceId: string) => void;
  onDeviceUninstall: (deviceId: string) => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  devices,
  loading,
  selectedDevice,
  onDeviceSelect,
  onDeviceUninstall,
  currentPage,
  onPageChange,
}: SidebarProps) {
  const { t } = useTranslation();

  const menuItems: Array<{
    icon: any;
    label: string;
    page: Page;
    count?: number;
  }> = [
    {
      icon: Home,
      label: t('sidebar.dashboard', 'Tableau de bord'),
      page: 'dashboard',
    },
    {
      icon: Smartphone,
      label: t('sidebar.devices', 'Appareils'),
      page: 'devices',
      count: devices.length,
    },
    {
      icon: Box,
      label: t('sidebar.applications', 'Applications'),
      page: 'applications',
    },
    {
      icon: Users,
      label: t('sidebar.users', 'Utilisateurs'),
      page: 'users',
    },
    {
      icon: User,
      label: t('sidebar.profile', 'Profil'),
      page: 'profile',
    },
    {
      icon: FileText,
      label: t('sidebar.reports', 'Rapports'),
      page: 'reports',
    },
    {
      icon: Wand2,
      label: t('sidebar.assistant', 'Assistant'),
      page: 'assistant',
    },
    {
      icon: Settings,
      label: t('sidebar.settings', 'Paramètres'),
      page: 'settings',
    },
  ];

  const handleNavigation = (page: Page) => {
    logger.info('Navigation sidebar', { from: currentPage, to: page });
    onPageChange(page);
    onClose();
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-56 bg-gray-900 text-white
        transform transition-transform duration-300 ease-in-out h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-3 border-b border-gray-700 py-0">
          {isOpen && (
            <>
              <h2 className="text-sm font-semibold text-gray-300 lg:hidden py-5">Menu</h2>
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded-md hover:bg-gray-800 text-gray-400 hover:text-gray-200"
              >
                <span className="sr-only">Fermer le menu</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
        </div>

        <nav className="flex-1 px-2 py-1 overflow-y-auto">
          <div className="flex-shrink-0 pt-2 pb-6">
            <UserProfileSidebar />
          </div>
          <ul className="space-y-0.5">
            {menuItems.map((item) => (
              <li key={item.page}>
                <NavLink
                  to={`/${item.page}`}
                  onClick={() => handleNavigation(item.page)}
                  className={({ isActive }) =>
                    `flex items-center h-7 px-2 rounded-lg transition-colors duration-150 text-sm
                    ${isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="ml-auto bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded-full text-xs flex-shrink-0">
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