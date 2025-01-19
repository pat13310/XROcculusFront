import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { LoginModal } from '../components/LoginModal';
import { useTranslation } from '../contexts/TranslationContext';
import { Footer } from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import { StatsSection } from '../components/StatsSection';
import { FeatureSection } from '../components/FeatureSection';
import { motion } from 'framer-motion';
import { HeroSection } from '../components/HeroSection';

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
        <div className="relative overflow-hidden">
          {isLoginModalOpen && <LoginModal onClose={handleCloseLoginModal} onLoginSuccess={handleLoginSuccess} />}
          <HeroSection handleOpenLoginModal={handleOpenLoginModal} />
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.8, 
            type: "spring", 
            stiffness: 50,
            delay: 0.2
          }}
          viewport={{ once: true }}
        >
          <FeatureSection />
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.8, 
            type: "spring", 
            stiffness: 50,
            delay: 0.2
          }}
          viewport={{ once: true }}
        >
          <StatsSection />
        </motion.div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}