import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { createLogger } from '../utils/logger';
import { useAuth } from '../hooks/useAuth';
import type { Page } from '../hooks/useNavigation';
import type { Device, DeviceStats } from '../types';

const logger = createLogger('Layout');

export interface LayoutProps {
  children: React.ReactNode;
  devices: Device[];
  stats: DeviceStats;
  loading: boolean;
  selectedDevice: string | null;
  onDeviceSelect: (deviceId: string) => void;
  onDeviceUninstall: (deviceId: string) => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  localIp: string | null;
}

export function Layout({ 
  children, 
  devices,
  stats,
  loading,
  selectedDevice,
  onDeviceSelect,
  onDeviceUninstall,
  currentPage,
  onPageChange,
  localIp
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar 
        onToggleSidebar={toggleSidebar}
        isAuthenticated={isAuthenticated}
        onSignOut={signOut}
        currentPage={currentPage}
        onNavigate={onPageChange}
        localIp={localIp}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          devices={devices}
          loading={loading}
          selectedDevice={selectedDevice}
          onDeviceSelect={onDeviceSelect}
          onDeviceUninstall={onDeviceUninstall}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}