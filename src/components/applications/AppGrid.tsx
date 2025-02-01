import React, { useState } from 'react';
import { AppCard } from '../AppCard';
import type { Application } from '../../types';

interface AppGridProps {
  apps: Application[];
  filter: 'all' | 'installed' | 'available';
}

export function AppGrid({ apps, filter }: AppGridProps) {
  const [installingAppId, setInstallingAppId] = useState<string | null>(null);

  const filteredApps = apps.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'installed') return app.installed;
    return !app.installed;
  });

  const handleInstall = async (id: string) => {
    setInstallingAppId(id);
    try {
      // TODO: Implement actual installation logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation
    } finally {
      setInstallingAppId(null);
    }
  };

  const handleUninstall = async (id: string) => {
    setInstallingAppId(id);
    try {
      // TODO: Implement actual uninstallation logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation
    } finally {
      setInstallingAppId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredApps.map(app => (
        <AppCard
          key={app.id}
          app={app}
          onInstall={handleInstall}
          onUninstall={handleUninstall}
          isInstalling={installingAppId === app.id}
        />
      ))}
    </div>
  );
}