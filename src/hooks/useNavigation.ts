import { useState, useCallback } from 'react';
import { createLogger } from '../utils/logger';
import { useNavigate as useRouterNavigate } from 'react-router-dom';

const logger = createLogger('Navigation');

export type Page = 'dashboard' | 'settings' | 'devices' | 'device-details' | 'applications' | 'users' | 'analytics' | 'reports' | 'assistant' | 'profile';

export function useNavigation() {
  const routerNavigate = useRouterNavigate();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const navigate = useCallback((page: Page, additionalPath?: string) => {
    logger.info('Navigating to page', { from: currentPage, to: page });
    setCurrentPage(page);
    
    // Mapper les pages à leurs routes avec possibilité de chemin supplémentaire
    const pageRoutes: Record<Page, string> = {
      'dashboard': '/dashboard',
      'settings': '/settings',
      'devices': '/devices',
      'device-details': '/devices', 
      'applications': '/applications',
      'users': '/users',
      'analytics': '/analytics',
      'reports': '/reports',
      'assistant': '/assistant',
      'profile': '/profile'
    };

    const route = additionalPath 
      ? `${pageRoutes[page]}/${additionalPath}` 
      : pageRoutes[page];

    routerNavigate(route);

    if (page !== 'device-details') {
      setSelectedDevice(null);
    }
  }, [currentPage, routerNavigate]);

  const navigateToDevice = useCallback((deviceId: string) => {
    logger.info('Navigating to device details', { deviceId });
    setSelectedDevice(deviceId);
    setCurrentPage('device-details');
    routerNavigate(`/devices/${deviceId}`);
  }, [routerNavigate]);

  return {
    currentPage,
    selectedDevice,
    navigate,
    navigateToDevice,
  };
}