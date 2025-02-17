import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDevices } from '../../hooks/useDevices';
import { Layout } from './../Layout';
import { createLogger } from '../../utils/logger';
import type { Page } from '../../hooks/useNavigation';

const logger = createLogger('AppLayout');

// Ajout de l'interface pour les props des composants
interface DeviceSelectionProps {
  onSelectDevice?: (deviceId: string) => void;
  onUninstallDevice?: (deviceId: string) => void;
  localIp?: string | null;
}

export function AppLayout({ 
  onSelectDevice = (deviceId: string) => {}, 
  onUninstallDevice = (deviceId: string) => {},
  localIp = null 
}: DeviceSelectionProps = {}) {
  const { devices, stats, loading: devicesLoading } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleDeviceSelect = (deviceId: string) => {
    logger.debug('Device selected', { deviceId });
    setSelectedDevice(deviceId);
    setCurrentPage('device-details');
    onSelectDevice(deviceId);
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
    onUninstallDevice(deviceId);
  };

  return (
    <Layout
      devices={devices}
      stats={stats}
      loading={devicesLoading}
      selectedDevice={selectedDevice}
      onDeviceSelect={handleDeviceSelect}
      onDeviceUninstall={handleDeviceUninstall}
      currentPage={currentPage}
      onPageChange={handleNavigate}
      localIp={localIp}
    >
      <Outlet context={{ 
        stats, 
        devices, 
        devicesLoading, 
        onSelectDevice: handleDeviceSelect, 
        onUninstallDevice: handleDeviceUninstall 
      }} />
    </Layout>
  );
}