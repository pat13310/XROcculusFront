import React from 'react';
import { DeviceCard } from './DeviceCard';
import { useTranslation } from '../contexts/TranslationContext';
import type { Device } from '../types';
import { Smartphone as Phone } from 'lucide-react';
import GradientHeader from './GradientHeader';

interface DeviceListProps {
  devices: Device[];
  onSelectDevice: (id: string) => void;
  onUninstallDevice?: (id: string) => void;
}

export function DeviceList({ devices, onSelectDevice, onUninstallDevice }: DeviceListProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
    {/* En-tête avec dégradé */}
    <GradientHeader
      titleKey="apps.title"
      defaultTitle="Appareils"
      Icon={Phone}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {devices.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          {t('devices.no_devices', 'Aucun appareil trouvé')}
        </div>
      ) : (
        devices.map(device => (
          <DeviceCard
            key={device.id}
            device={device}
            onSelect={onSelectDevice}
            onUninstall={onUninstallDevice}
          />
        ))
      )}
    </div>
    </div>
  );
}