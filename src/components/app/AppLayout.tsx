import React, { useState } from 'react';
import { Dashboard } from '../../pages/Dashboard';
import { Settings } from '../../pages/Settings';
import { Applications } from '../../pages/Applications';
import { Users } from '../../pages/Users';
import { DeviceList } from '../DeviceList';
import { DeviceDetailsPage } from '../../pages/DeviceDetailsPage';
import { useDevices } from '../../hooks/useDevices';
import { Layout } from '../Layout';
import type { Page } from '../../hooks/useNavigation';
import { Reports } from '../../pages/Reports';

export function AppLayout() {
  const { devices, stats, loading: devicesLoading } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setCurrentPage('device-details');
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page !== 'device-details') {
      setSelectedDevice(null);
    }
  };

  const handleDeviceUninstall = (deviceId: string) => {
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