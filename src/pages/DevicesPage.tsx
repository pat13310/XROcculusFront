import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { DeviceList } from '../components/DeviceList';
import { useDevices } from '../hooks/useDevices';
import { useNavigation } from '../hooks/useNavigation';

// Ajout de l'interface pour les props
interface DevicesPageContextProps {
  onSelectDevice: (deviceId: string) => void;
  onUninstallDevice: (deviceId: string) => void;
}

export function DevicesPage() {
  const { devices, loading } = useDevices();
  const { navigateToDevice } = useNavigation();

  const { 
    onSelectDevice, 
    onUninstallDevice 
  } = useOutletContext<DevicesPageContextProps>();

  const handleSelectDevice = (deviceId: string) => {
    onSelectDevice(deviceId);
    navigateToDevice(deviceId);
  };

  const handleUninstallDevice = (deviceId: string) => {
    onUninstallDevice(deviceId);
  };

  return (
    <div>
      <DeviceList 
        devices={devices} 
        onSelectDevice={handleSelectDevice}
        onUninstallDevice={handleUninstallDevice}
      />
      {loading && <div>Chargement des appareils...</div>}
    </div>
  );
}
