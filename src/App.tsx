import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from './components/app/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { DevicesPage } from './pages/DevicesPage';
import { UsersPage } from './pages/UsersPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AssistantPage } from './pages/AssistantPage';
import { DeviceDetailsPage } from './pages/DeviceDetailsPage'; // Added import for DeviceDetailsPage
import { useAuth } from './hooks/useAuth';
import { useDevices } from './hooks/useDevices';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TranslationProvider } from './contexts/TranslationContext';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { devices, stats, loading: devicesLoading } = useDevices();

  console.log('App Authentication State:', { 
    isAuthenticated, 
    isLoading 
  });

  const handleSelectDevice = (device: any) => {
    // Vous pouvez implémenter la logique de sélection de l'appareil ici
    console.log('Device selected:', device);
  };

  const handleUninstallDevice = (deviceId: string) => {
    // Logique de désinstallation de l'appareil
    console.log('Device uninstalled:', deviceId);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <TranslationProvider>
      <ErrorBoundary>
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<DashboardPage 
                stats={stats} 
                devices={devices} 
                devicesLoading={devicesLoading}
                onSelectDevice={handleSelectDevice}
              />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="devices" element={<DevicesPage 
                onSelectDevice={handleSelectDevice}
                onUninstallDevice={handleUninstallDevice}
              />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="assistant" element={<AssistantPage />} />
              <Route path="devices/:deviceId" element={<DeviceDetailsPage />} />
            </Route>
          </Routes>
        ) : (
          <LandingPage />
        )}
      </ErrorBoundary>
    </TranslationProvider>
  );
}