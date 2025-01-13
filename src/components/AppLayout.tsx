import React, { useState } from 'react';
import { Dashboard } from '../pages/Dashboard';
import { Settings } from '../pages/SettingsPage';
import { Applications } from '../pages/ApplicationsPage';
import { Users } from '../pages/UsersPage';
import { Analytics } from '../pages/AnalyticsPage';
import { Reports } from '../pages/ReportsPage';
import { DeviceList } from './DeviceList';
import { DeviceDetailsPage } from '../pages/DeviceDetailsPage';
import { useDevices } from '../hooks/useDevices';
import { Layout } from './Layout';
import { createLogger } from '../utils/logger';
import type { Page } from '../hooks/useNavigation';

const logger = createLogger('AppLayout');

export function AppLayout() {
  const { devices, stats, loading: devicesLoading } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleDeviceSelect = (deviceId: string) => {
    logger.debug('Device selected', { deviceId });
    setSelectedDevice(deviceId);
    setCurrentPage('device-details');
  };

  const handleNavigate = (page: Page) => {
    logger.debug('Navigation requested', { from: currentPage, to: page });
    setCurrentPage(page);
    if (page !== 'device-details') {
      setSelectedDevice(null);
    }
  };

  const handleDeviceUninstall = (deviceId: string) => {
    logger.debug('Device uninstall requested', { deviceId });
    // Implement device uninstall logic here
    console.log('Uninstalling device:', deviceId);
  };

  return (
    <Layout onNavigate={handleNavigate} currentPage={currentPage} deviceCount={stats.totalDevices}>
      {currentPage === 'dashboard' && (
        <Dashboard 
          stats={stats}
          devices={devices}
          devicesLoading={devicesLoading}
          onSelectDevice={handleDeviceSelect}
          onUninstallDevice={handleDeviceUninstall}
        />
      )}
      {currentPage === 'devices' && !devicesLoading && (
        <DeviceList 
          devices={devices} 
          onSelectDevice={handleDeviceSelect}
          onUninstallDevice={handleDeviceUninstall}
        />
      )}
      {currentPage === 'settings' && <Settings />}
      {currentPage === 'applications' && <Applications />}
      {currentPage === 'users' && <Users />}
      {currentPage === 'analytics' && <Analytics />}
      {currentPage === 'reports' && <Reports />}
      {currentPage === 'device-details' && selectedDevice && (
        <DeviceDetailsPage 
          deviceId={selectedDevice}
          onBack={() => setCurrentPage('devices')}
        />
      )}
    </Layout>
  );
}