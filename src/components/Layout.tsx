import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { createLogger } from '../utils/logger';
import type { Page } from '../hooks/useNavigation';
import { useAuth } from '../hooks/useAuth';

const logger = createLogger('Layout');

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  deviceCount: number;
}

export function Layout({ children, onNavigate, currentPage, deviceCount }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    logger.info('Layout mounted', { currentPage });
    return () => {
      logger.debug('Layout unmounting');
    };
  }, [currentPage]);

  const handleNavigate = (page: Page) => {
    logger.debug('Navigation requested', { to: page });
    onNavigate(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        isAuthenticated={isAuthenticated}
        onSignOut={signOut}
      />
      
      <div className="flex-1 flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          currentPage={currentPage}
          deviceCount={deviceCount}
          onNavigate={handleNavigate}
        />
        
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}