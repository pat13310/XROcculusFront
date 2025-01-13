import {
  Home,
  Smartphone,
  Box,
  Users,
  Settings,
  Activity,
  FileText,
} from 'lucide-react';
import { NavLink } from './navigation/NavLink';
import { useTranslation } from '../contexts/TranslationContext';
import { createLogger } from '../utils/logger';
import type { Page } from '../hooks/useNavigation';

const logger = createLogger('Sidebar');

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  deviceCount: number;
}

export function Sidebar({
  isOpen,
  onClose,
  onNavigate,
  currentPage,
  deviceCount,
}: SidebarProps) {
  const { t } = useTranslation();

  const menuItems = [
    {
      icon: Home,
      label: t('sidebar.dashboard', 'Tableau de bord'),
      page: 'dashboard' as Page,
    },
    {
      icon: Smartphone,
      label: t('sidebar.devices', 'Appareils'),
      page: 'devices' as Page,
      count: deviceCount,
    },
    {
      icon: Box,
      label: t('sidebar.applications', 'Applications'),
      page: 'applications' as Page,
    },
    {
      icon: Activity,
      label: t('sidebar.analytics', 'Analytique'),
      page: 'analytics' as Page,
    },
    {
      icon: FileText,
      label: t('sidebar.reports', 'Rapports'),
      page: 'reports' as Page,
    },
    {
      icon: Users,
      label: t('sidebar.users', 'Utilisateurs'),
      page: 'users' as Page,
    },
    {
      icon: Settings,
      label: t('sidebar.settings', 'Paramètres'),
      page: 'settings' as Page,
    },
  ];

  const handleNavigate = (page: Page) => {
    logger.debug('Navigation depuis la barre latérale', { from: currentPage, to: page });
    onNavigate(page);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-0
        `}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 py-6 overflow-y-auto">
            <nav className="px-4 space-y-2">
              {menuItems.map(({ icon, label, page, count }) => (
                <NavLink
                  key={page}
                  icon={icon}
                  label={label}
                  isActive={currentPage === page}
                  count={count}
                  onClick={() => handleNavigate(page)}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}