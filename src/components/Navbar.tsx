import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Settings, Glasses, LogIn } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { supabase } from '../lib/supabase';
import { createLogger } from '../utils/logger';
import Button from './ui/Button';
import { FiLogOut } from 'react-icons/fi';
import { LoginModal } from './LoginModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const logger = createLogger('Navbar');

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigate: (page: 'dashboard' | 'settings' | 'devices' | 'device-details' | 'analytics' | 'users' | 'reports' | 'applications') => void;
  currentPage: 'dashboard' | 'settings' | 'devices' | 'device-details' | 'analytics' | 'users' | 'reports' | 'applications';
  isAuthenticated: boolean;
  onSignOut: () => void;
  onLogin?: () => void;
}

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  created_at: string;
  read: boolean;
}

export function Navbar({
  onToggleSidebar,
  onNavigate,
  isAuthenticated,
  onLogin
}: Omit<NavbarProps, 'onSignOut'>) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { signOut } = useAuth(); // Utiliser le hook useAuth directement
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const alertsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      // Ne récupérer les alertes que si l'utilisateur est connecté
      if (!isAuthenticated) {
        setAlerts([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setAlerts(data || []);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        logger.error('Erreur lors du chargement des alertes:', errorMessage.toString);
      }
    };

    fetchAlerts();

    const alertsSubscription = supabase
      .channel('alerts-channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        fetchAlerts
      )
      .subscribe();

    return () => {
      alertsSubscription.unsubscribe();
    };
  }, [isAuthenticated]);

  // Gestionnaire de clic en dehors du menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        alertsRef.current &&
        buttonRef.current &&
        !alertsRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowAlerts(false);
      }
    };

    if (showAlerts) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAlerts]);

  const markAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ read: true })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      logger.error('Erreur lors du marquage de l\'alerte comme lue:', errorMessage.toString);
    }
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  // Gestionnaire de navigation personnalisé
  const handleCustomNavigation = (page: 'dashboard' | 'settings' | 'devices' | 'device-details' | 'analytics' | 'users' | 'reports' | 'applications') => {
    // Si l'utilisateur est connecté et tente de naviguer alors qu'il est déjà sur la page de landing
    if (isAuthenticated && location.pathname === '/') {
      // Rediriger vers le dashboard
      navigate('/dashboard');
    } else {
      // Sinon, utiliser la navigation normale
      onNavigate(page);
    }
  };

  const handleSignOut = () => {
    signOut(); // Déconnexion
    
    // Forcer la navigation vers la page d'accueil
    window.location.href = '/'; // Rechargement complet de la page
  };

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo et bouton sidebar */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onToggleSidebar} 
              className="text-gray-400 hover:text-gray-200 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-violet-800/30 rounded-lg">
                <Glasses className="h-5 w-5 text-violet-400" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Gestionnaire VR
              </span>
            </div>
          </div>

          {/* Navigation et actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button 
              ref={buttonRef}
              onClick={() => setShowAlerts(!showAlerts)} 
              className="relative text-gray-400 hover:text-gray-200"
            >
              <Bell className="h-5 w-5" />
              {alerts.filter(alert => !alert.read).length > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>

            {/* Boutons de navigation */}
            <div className="hidden md:flex space-x-2">
              {isAuthenticated ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleCustomNavigation('dashboard')}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    Tableau de bord
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleCustomNavigation('settings')}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    {t('navbar.settings', 'Paramètres')}
                  </Button>
                  <Button 
                    variant="gradient" 
                    onClick={handleSignOut}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <FiLogOut className="h-4 w-4 mr-1" />
                    {t('navbar.logout', 'Déconnexion')}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/')}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    Accueil
                  </Button>
                  <Button 
                    variant="gradient" 
                    onClick={() => setShowLoginModal(true)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <LogIn className="h-4 w-4 mr-1" />
                    {t('navbar.login', 'Connexion')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu des alertes */}
      {showAlerts && (
        <div 
          ref={alertsRef} 
          className="absolute right-0 mt-2 mr-4 w-80 bg-gray-800 rounded-lg shadow-lg z-50"
        >
          {/* Contenu des alertes */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              {t('navbar.alerts', 'Alertes récentes')}
            </h3>
            {alerts.length === 0 ? (
              <p className="text-xs text-gray-500">
                {t('navbar.no_alerts', 'Aucune alerte')}
              </p>
            ) : (
              alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-2 mb-2 rounded ${
                    alert.type === 'warning' ? 'bg-yellow-900/30 text-yellow-400' :
                    alert.type === 'error' ? 'bg-red-900/30 text-red-400' :
                    'bg-blue-900/30 text-blue-400'
                  } text-xs`}
                >
                  <div className="font-semibold">{alert.title}</div>
                  <div>{alert.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onLoginSuccess={() => {
            setShowLoginModal(false);
            onNavigate('dashboard');
          }} 
          onNavigate={onNavigate}
        />
      )}
    </nav>
  );
}