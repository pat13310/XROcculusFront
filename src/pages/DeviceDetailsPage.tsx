import React from 'react';
import { ChevronLeft, Glasses } from 'lucide-react';
import { DeviceHeader } from '../components/device-details/DeviceHeader';
import { DeviceStats } from '../components/device-details/DeviceStats';
import { DeviceApps } from '../components/device-details/DeviceApps';
import { DeviceActivity } from '../components/device-details/DeviceActivity';
import { useDevice } from '../hooks/useDevice';
import { LoadingScreen } from '../components/LoadingScreen';
import { ErrorScreen } from '../components/ErrorScreen';
import GradientHeader from '../components/GradientHeader';

interface DeviceDetailsPageProps {
  deviceId: string;
  onBack: () => void;
}

export function DeviceDetailsPage({ deviceId, onBack }: DeviceDetailsPageProps) {
  const { device, loading, error } = useDevice(deviceId);

  if (loading) return <LoadingScreen message="Loading device details..." />;
  if (error) return <ErrorScreen message="Failed to load device details" />;
  if (!device) return <ErrorScreen message="Device not found" />;

  return (
    <div className="space-y-6">
      {/* En-tête avec dégradé */}
      <GradientHeader
        titleKey="apps.title"
        defaultTitle="Appareils"
        Icon={Glasses}
      />
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Retour
      </button>
      <DeviceHeader device={device} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DeviceStats device={device} />
          <DeviceApps deviceId={device.id} />
        </div>
        <div className="lg:col-span-1">
          <DeviceActivity deviceId={device.id} />
        </div>
      </div>
    </div>
  );
}