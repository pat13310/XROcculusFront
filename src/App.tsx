import React, { useEffect } from 'react';
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
import { DeviceDetailsPage } from './pages/DeviceDetailsPage';
import { useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TranslationProvider } from './contexts/TranslationContext';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useIP } from './hooks/useIP';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { ip, loading: ipLoading, error: ipError } = useIP();

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

  if (isLoading || ipLoading) {
    return <div>Chargement...</div>;
  }

  if (ipError) {
    console.error('Erreur lors de la récupération de l\'IP:', ipError);
  }

  return (
    <ErrorBoundary>
      <TranslationProvider>
        <ToastContainer position="top-right" autoClose={5000} />
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<DashboardPage 
              />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="devices" element={<DevicesPage 
              />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="applications" element={<ApplicationsPage 
              />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="assistant" element={<AssistantPage />} />
              <Route path="devices/:deviceId" element={<DeviceDetailsPage />} />
            </Route>
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </TranslationProvider>
    </ErrorBoundary>
  );
}