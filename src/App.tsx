import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from './components/app/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ProfilePage } from './pages/ProfilePage';
import { DevicesPage } from './pages/DevicesPage';
import { Users } from './pages/UsersPage';
import { Applications } from './pages/ApplicationsPage';
import { Reports } from './pages/ReportsPage';
import { Settings } from './pages/SettingsPage';
import { AssistantPage } from './pages/AssistantPage';
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

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <TranslationProvider>
      <ErrorBoundary>
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard 
                stats={stats} 
                devices={devices} 
                devicesLoading={devicesLoading}
                onSelectDevice={handleSelectDevice}
              />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="devices" element={<DevicesPage />} />
              <Route path="users" element={<Users />} />
              <Route path="applications" element={<Applications />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="assistant" element={<AssistantPage />} />
            </Route>
          </Routes>
        ) : (
          <LandingPage />
        )}
      </ErrorBoundary>
    </TranslationProvider>
  );
}