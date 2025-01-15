import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/app/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/SettingsPage';
import { DeviceList } from './components/DeviceList';
import { DeviceDetailsPage } from './pages/DeviceDetailsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { Users } from './pages/UsersPage';
import { Reports } from './pages/ReportsPage';
import { Applications } from './pages/ApplicationsPage';
import { useAuth } from './hooks/useAuth';
import { LoadingScreen } from './components/LoadingScreen';
import { TranslationProvider } from './contexts/TranslationContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  console.log(' App Authentication State:', { 
    isAuthenticated, 
    isLoading 
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <TranslationProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" />} />
          
          {/* Routes protégées */}
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="settings" element={<Settings />} />
                <Route path="devices" element={<DeviceList />} />
                <Route path="devices/:deviceId" element={<DeviceDetailsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="users" element={<Users />} />
                <Route path="reports" element={<Reports />} />
                <Route path="applications" element={<Applications />} />
              </Route>
              
              {/* Redirection par défaut pour les routes non trouvées */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            // Redirection pour les routes non autorisées
            <Route path="*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </TranslationProvider>
    </ErrorBoundary>
  );
}