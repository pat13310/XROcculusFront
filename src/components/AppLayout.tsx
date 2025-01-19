import React, { useState } from 'react';
import { DashboardPage } from '../pages/DashboardPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ApplicationsPage } from '../pages/ApplicationsPage';
import { UsersPage } from '../pages/UsersPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { ReportsPage } from '../pages/ReportsPage';
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
        <DashboardPage 
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
      {currentPage === 'settings' && <SettingsPage />}
      {currentPage === 'applications' && <ApplicationsPage />}
      {currentPage === 'users' && <UsersPage />}
      {currentPage === 'analytics' && <AnalyticsPage />}
      {currentPage === 'reports' && <ReportsPage />}
      {currentPage === 'device-details' && selectedDevice && (
        <DeviceDetailsPage 
          deviceId={selectedDevice}
          onBack={() => setCurrentPage('devices')}
        />
      )}
    </Layout>
  );
}