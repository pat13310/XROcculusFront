import { AppLayout } from './components/app/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { useAuth } from './hooks/useAuth';
import { LoadingScreen } from './components/LoadingScreen';
import { TranslationProvider } from './contexts/TranslationContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <TranslationProvider>
        {!isAuthenticated ? <LandingPage /> : <AppLayout />}
      </TranslationProvider>
    </ErrorBoundary>
  );
}