import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from '../Layout';
import { useDevices } from '../../hooks/useDevices';
import { useNavigation } from '../../hooks/useNavigation';

export function AppLayout() {
  const { devices, stats, loading: devicesLoading } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const { currentPage, navigate } = useNavigation();

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    navigate('device-details');
  };

  return (
    <Layout 
      deviceCount={devices.length} 
      currentPage={currentPage}
      onNavigate={navigate}
    >
      <Outlet context={{ devices, stats: null, devicesLoading: false }} />
    </Layout>
  );
}