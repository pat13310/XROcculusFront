import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Glasses, Shield, Zap, Users, ChevronRight, ArrowRight, LogOut } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { LoginModal } from '../components/LoginModal';
import { useTranslation } from '../contexts/TranslationContext';
import { Footer } from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

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

  const features = [
    {
      icon: Shield,
      title: t('landing.features.security.title', 'Sécurité Entreprise'),
      description: t('landing.features.security.description', 'Sécurité de niveau entreprise avec contrôle d\'accès basé sur les rôles et surveillance en temps réel.'),
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Zap,
      title: t('landing.features.monitoring.title', 'Surveillance en Temps Réel'),
      description: t('landing.features.monitoring.description', 'Surveillez l\'état des appareils, les niveaux de batterie et l\'utilisation du stockage en temps réel.'),
      image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Users,
      title: t('landing.features.collaboration.title', 'Collaboration d\'Équipe'),
      description: t('landing.features.collaboration.description', 'Collaboration d\'équipe transparente avec des autorisations granulaires et suivi des activités.'),
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
    }
  ];

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
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
          {t('landing.hero.title', 'Gérez Vos Appareils VR')}
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-gray-600 mb-10">
          {t('landing.hero.subtitle', 'Une plateforme centralisée pour gérer, surveiller et sécuriser vos appareils de réalité virtuelle.')}
        </p>
        <div className="flex justify-center space-x-4 mb-16">
          <a 
            href="#features" 
            className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>{t('landing.hero.learn_more', 'En Savoir Plus')}</span>
            <ArrowRight className="h-5 w-5" />
          </a>
          
          {isAuthenticated ? (
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>{t('landing.hero.go_to_dashboard', 'Aller au Dashboard')}</span>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button 
                onClick={handleSignOut}
                className="px-6 py-3 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>{t('landing.hero.sign_out', 'Déconnexion')}</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={handleOpenLoginModal}
              className="px-6 py-3 border border-gray-300 text-gray-900 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              {t('landing.hero.get_started', 'Commencer')}
            </button>
          )}
        </div>

        {/* Features Section */}
        <section id="features" className="grid md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <feature.icon className="h-12 w-12 mx-auto mb-4 text-gray-900" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </section>

        {/* Stats Section */}
        <div className="bg-gray-900 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white">
                {t('landing.stats.title', 'Notre Impact')}
              </h2>
              <p className="mt-4 text-gray-300">
                {t('landing.stats.subtitle', 'Des chiffres qui montrent notre engagement envers la gestion des appareils VR')}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
              <div>
                <p className="text-5xl font-extrabold text-white mb-2">500+</p>
                <p className="text-gray-300">
                  {t('landing.stats.devices_managed', 'Appareils Gérés')}
                </p>
              </div>
              <div>
                <p className="text-5xl font-extrabold text-white mb-2">99.9%</p>
                <p className="text-gray-300">
                  {t('landing.stats.uptime', 'Temps de Disponibilité')}
                </p>
              </div>
              <div>
                <p className="text-5xl font-extrabold text-white mb-2">24/7</p>
                <p className="text-gray-300">
                  {t('landing.stats.support', 'Support Client')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />

        {/* Login Modal */}
        {isLoginModalOpen && (
          <LoginModal 
            onClose={handleCloseLoginModal}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </main>
    </div>
  );
}