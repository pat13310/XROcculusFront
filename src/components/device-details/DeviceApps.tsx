import React from 'react';
import { Package } from 'lucide-react';
import { useDeviceApps } from '../../hooks/useDeviceApps';
import { AppCard } from '../AppCard';

interface DeviceAppsProps {
  deviceId: string;
}

export function DeviceApps({ deviceId }: DeviceAppsProps) {
  const { apps, loading } = useDeviceApps(deviceId);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Installed Applications
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Install New App
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-500">Loading applications...</div>
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
              onInstall={() => {}}
              onUninstall={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}