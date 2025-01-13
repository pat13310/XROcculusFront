import React, { useState } from 'react';
import { Battery, Signal, HardDrive, Clock, Trash2 } from 'lucide-react';
import { ConfirmationModal } from './modals/ConfirmationModal';
import { useTranslation } from '../contexts/TranslationContext';
import { formatDate, formatBytes } from '../utils/formatters';
import { GradientProgressBar } from './dashboard/GradientProgressBar';
import { createLogger } from '../utils/logger';
import type { Device } from '../types';

const logger = createLogger('DeviceCard');

interface DeviceCardProps {
  device: Device;
  onSelect: (id: string) => void;
  onUninstall?: (id: string) => void;
}

export function DeviceCard({ device, onSelect, onUninstall }: DeviceCardProps) {
  const [showUninstallModal, setShowUninstallModal] = useState(false);
  const { t } = useTranslation();

  const batteryLevel = typeof device.batteryLevel === 'number' && !isNaN(device.batteryLevel)
    ? Math.max(0, Math.min(100, device.batteryLevel))
    : 0;

  const storageUsed = typeof device.storageUsed === 'number' && !isNaN(device.storageUsed)
    ? Math.max(0, device.storageUsed)
    : 0;

  const storageTotal = typeof device.storageTotal === 'number' && !isNaN(device.storageTotal)
    ? Math.max(1, device.storageTotal)
    : 1;

  const lastSync = (() => {
    try {
      const date = new Date(device.lastSync);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch (e) {
      logger.warn('Date de synchronisation invalide', { deviceId: device.id, lastSync: device.lastSync });
      return new Date();
    }
  })();

  const handleUninstall = () => {
    if (onUninstall) {
      logger.info('Désinstallation de l\'appareil', { deviceId: device.id });
      onUninstall(device.id);
    }
    setShowUninstallModal(false);
  };

  return (
    <>
      <div 
        onClick={() => onSelect(device.id)}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer border border-gray-100 group"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
            <p className="text-sm text-gray-600">{device.model}</p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            device.status === 'online' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-gray-50 text-gray-700'
          }`}>
            {device.status === 'online' ? 'En ligne' : 'Hors ligne'}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Battery className={`w-4 h-4 mr-1.5 ${
                  batteryLevel > 20 ? 'text-gray-500' : 'text-red-500'
                }`} />
                <span className="text-sm text-gray-600">
                  {t('devices.battery_level', 'Batterie')}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {batteryLevel}%
              </span>
            </div>
            <GradientProgressBar
              value={batteryLevel}
              max={100}
              size="md"
              type="percentage"
              showValue={false}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <HardDrive className="w-4 h-4 mr-1.5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {t('devices.storage', 'Stockage')}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {formatBytes(storageUsed)} / {formatBytes(storageTotal)}
              </span>
            </div>
            <GradientProgressBar
              value={storageUsed}
              max={storageTotal}
              size="md"
              type="storage"
              showValue={false}
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-sm text-gray-600 flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              {t('devices.last_synced', 'Dernière synchro')}
            </span>
            <span className="text-sm font-medium">
              {formatDate(lastSync)}
            </span>
          </div>
        </div>

        {onUninstall && (
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUninstallModal(true);
              }}
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 border border-gray-200"
            >
              <Trash2 className="w-4 h-4 text-gray-500" />
              <span>{t('devices.uninstall', 'Désinstaller')}</span>
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showUninstallModal}
        title={t('devices.uninstall_confirm_title', 'Confirmer la désinstallation')}
        message={t('devices.uninstall_confirm_message', 'Êtes-vous sûr de vouloir désinstaller {device} ? Cette action ne peut pas être annulée.', { device: device.name })}
        confirmLabel={t('devices.uninstall', 'Désinstaller')}
        cancelLabel={t('common.cancel', 'Annuler')}
        onConfirm={handleUninstall}
        onCancel={() => setShowUninstallModal(false)}
      />
    </>
  );
}