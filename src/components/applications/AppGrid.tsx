import React from 'react';
import { AppCard } from '../AppCard';
import type { Application } from '../../types';

interface AppGridProps {
  apps: Application[];
  filter: 'all' | 'installed' | 'available';
}

export function AppGrid({ apps, filter }: AppGridProps) {
  const filteredApps = apps.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'installed') return app.installed;
    return !app.installed;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredApps.map(app => (
        <AppCard
          key={app.id}
          app={app}
          onInstall={() => {}}
          onUninstall={() => {}}
        />
      ))}
    </div>
  );
}