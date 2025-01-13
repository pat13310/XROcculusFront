import { useState, useCallback } from 'react';
import { createLogger } from '../utils/logger';

const logger = createLogger('Navigation');

export type Page = 'dashboard' | 'settings' | 'devices' | 'device-details' | 'applications' | 'users' | 'analytics' | 'reports';

export function useNavigation() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const navigate = useCallback((page: Page) => {
    logger.info('Navigating to page', { from: currentPage, to: page });
    setCurrentPage(page);
    if (page !== 'device-details') {
      setSelectedDevice(null);
    }
  }, [currentPage]);

  const navigateToDevice = useCallback((deviceId: string) => {
    logger.info('Navigating to device details', { deviceId });
    setSelectedDevice(deviceId);
    setCurrentPage('device-details');
  }, []);

  return {
    currentPage,
    selectedDevice,
    navigate,
    navigateToDevice,
  };
}