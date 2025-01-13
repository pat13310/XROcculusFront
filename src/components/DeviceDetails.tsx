import React from 'react';
import { X } from 'lucide-react';
import { AppCard } from './AppCard';
import { useDeviceApps } from '../hooks/useDeviceApps';
import { installApp, uninstallApp } from '../services/deviceApps';

interface DeviceDetailsProps {
  deviceId: string;
  onClose: () => void;
}

export function DeviceDetails({ deviceId, onClose }: DeviceDetailsProps) {
  const { apps, loading } = useDeviceApps(deviceId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Device Applications</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading device apps...</div>
          ) : (
            <div className="space-y-4">
              {apps.map(({ app, status }) => (
                <AppCard
                  key={app.id}
                  app={{
                    ...app,
                    installed: status === 'installed',
                    installationStatus: status
                  }}
                  onInstall={() => installApp(deviceId, app.id)}
                  onUninstall={() => uninstallApp(deviceId, app.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}