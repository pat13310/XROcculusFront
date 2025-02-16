import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { createLogger } from '../utils/logger';
import { useAuth } from '../hooks/useAuth';
import type { Page } from '../hooks/useNavigation';

const logger = createLogger('Layout');

export interface LayoutProps {
  children: React.ReactNode;
  deviceCount: number;
  onNavigate?: (page: Page) => void;
  currentPage?: Page;
  onDeviceSelect?: (deviceId: string) => void;
}

export function Layout({ children, deviceCount, onNavigate, currentPage, onDeviceSelect }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isAuthenticated={isAuthenticated}
        onSignOut={signOut}
        onNavigate={onNavigate}
        currentPage={currentPage}
      />
      
      <div className="flex-1 flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          deviceCount={deviceCount}
          onDeviceSelect={onDeviceSelect}
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}