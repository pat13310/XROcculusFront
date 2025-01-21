import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { LoginModal } from '../components/LoginModal';
import { useTranslation } from '../contexts/TranslationContext';
import { useAuth } from '../hooks/useAuth';
import { HeroSection } from '../components/HeroSection';
import { Footer } from '../components/Footer';

// Lazy loading des composants moins critiques
const StatsSection = lazy(() => import('../components/StatsSection'));
const FeatureSection = lazy(() => import('../components/FeatureSection'));

// Composant de chargement
const LoadingSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto px-4 py-12">
    <div className="animate-pulse space-y-8">
      <div className="h-64 bg-gray-200/20 rounded-xl"></div>
      <div className="h-32 bg-gray-200/20 rounded-xl"></div>
    </div>
  </div>
);

export function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated, signOut } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Déterminer la page courante en fonction de l'URL
  const getCurrentPage = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'dashboard';
      case '/dashboard':
        return 'dashboard';
      case '/settings':
        return 'settings';
      case '/devices':
        return 'devices';
      case '/analytics':
        return 'analytics';
      case '/users':
        return 'users';
      case '/reports':
        return 'reports';
      case '/applications':
        return 'applications';
      default:
        return 'dashboard';
    }
  };

  const [currentPage, setCurrentPage] = useState<'dashboard' | 'settings' | 'devices' | 'device-details' | 'analytics' | 'users' | 'reports' | 'applications'>(getCurrentPage());

  // Mettre à jour la page courante quand l'URL change
  useEffect(() => {
    setCurrentPage(getCurrentPage());
  }, [location.pathname]);

  // Redirection automatique si authentifié
  useEffect(() => {
    if (isAuthenticated && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Props par défaut pour le Navbar sur la page de connexion
  const handleToggleSidebar = () => {};
  const handleNavigate = (page: 'dashboard' | 'settings' | 'devices' | 'device-details' | 'analytics' | 'users' | 'reports' | 'applications') => {
    switch(page) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'devices':
        navigate('/devices');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'users':
        navigate('/users');
        break;
      case 'reports':
        navigate('/reports');
        break;
      case 'applications':
        navigate('/applications');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleSignOut = () => {
    // Effacer tous les tokens et informations d'authentification
    localStorage.removeItem('access_token');
    localStorage.removeItem('isAuthenticated');
    
    // Appeler la fonction de déconnexion du hook useAuth
    signOut();
    
    // Scroll en haut de la page
    window.scrollTo(0, 0);
    
    // Revenir à la page d'accueil
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-neutral-50">
      <Navbar 
        onToggleSidebar={handleToggleSidebar}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        onLogin={handleOpenLoginModal}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 text-center">
        <div className="relative overflow-hidden">
          {isLoginModalOpen && <LoginModal onClose={handleCloseLoginModal} onLoginSuccess={handleLoginSuccess} />}
          <HeroSection handleOpenLoginModal={handleOpenLoginModal} />
        </div>

        {/* Features Section avec animation CSS native */}
        <div className="opacity-0 translate-x-full animate-slide-in-right [--delay:200ms]">
          <Suspense fallback={<LoadingSkeleton />}>
            <FeatureSection />
          </Suspense>
        </div>

        {/* Stats Section avec animation CSS native */}
        <div className="opacity-0 translate-x-[-100%] animate-slide-in-left [--delay:400ms]">
          <Suspense fallback={<LoadingSkeleton />}>
            <StatsSection />
          </Suspense>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}