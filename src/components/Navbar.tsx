import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Settings, LogIn, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { supabase } from '../lib/supabase';
import { createLogger } from '../utils/logger';
import Button from './ui/Button';
import { FiLogOut } from 'react-icons/fi';
import { LoginModal } from './LoginModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Page } from '../hooks/useNavigation';

const logger = createLogger('Navbar');

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  created_at: string;
  read: boolean;
}

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  isAuthenticated: boolean;
  onSignOut: () => void;
  onLogin?: () => void;
  localIp: string | null;
}

export function Navbar({
  onToggleSidebar,
  onNavigate,
  currentPage,
  isAuthenticated,
  onLogin,
  onSignOut,
  localIp
}: NavbarProps) {
  const { t } = useTranslation();
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const alertsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alertsRef.current && buttonRef.current && 
          !alertsRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)) {
        setShowAlerts(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      onSignOut();
    } catch (error) {
      const errorRecord = error instanceof Error 
        ? { message: error.message, name: error.name }
        : { message: String(error) };
      logger.error('Erreur lors de la déconnexion:', errorRecord);
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
  };

  return (
    <nav className="w-full bg-gray-900 text-gray-100 shadow-md">
      <div className="w-full px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo et bouton sidebar */}
          <div className="flex items-center space-x-2 xs:space-x-1">
            <button
              onClick={onToggleSidebar}
              className="text-gray-400 hover:text-gray-200 focus:outline-none lg:hidden"
            >
              <Menu className="h-6 w-6 xs:h-4 xs:w-4" />
            </button>

            <div className="flex items-center space-x-2 xs:space-x-1">
              <img
                src="images/horus2.svg"
                alt="Logo"
                className="h-11 w-11 xs:h-4 xs:w-4"
              />
              <span className="text-lg xs:text-xs md:text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Gestionnaire XR
              </span>
            </div>
          </div>

          {/* Partie droite */}
          <div className="flex items-center space-x-4">
            <button
              ref={buttonRef}
              onClick={() => setShowAlerts(!showAlerts)}
              className="relative text-gray-400 hover:text-gray-200 xs:scale-75"
            >
              <Bell className="h-5 w-5 xs:h-4 xs:w-4" />
              {alerts.filter(alert => !alert.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {alerts.filter(alert => !alert.read).length}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      navigate('/settings');
                    }}
                    className="text-gray-400 hover:text-gray-300 dark:text-gray-200 dark:hover:text-gray-200"
                  >
                    <Settings className="h-5 w-5 mr-4" />
                  </button>
                  <Button
                    variant="gradient"
                    onClick={handleSignOut}
                    className="text-gray-400 hover:text-gray-200 xs:text-xs xs:px-2 xs:py-1 md:text-sm md:px-4 md:py-2"
                  >
                    <FiLogOut className="h-4 w-4 xs:h-3 xs:w-3 mr-1" />
                    {t('navbar.logout', 'Déconnexion')}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="gradient"
                    onClick={() => setShowLoginModal(true)}
                    className="xs:text-xs xs:px-2 xs:py-0 md:text-sm md:px-4 md:py-2 text-gray-400 hover:text-gray-200"
                  >
                    <LogIn className="xs:h-2 xs:w-2 h-4 w-4 mr-1" />
                    {t('navbar.login', 'Connexion')}
                  </Button>
                </>
              )}
            </div>
            {localIp && (
              <div className="text-sm text-gray-400">
                IP: {localIp}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panneau des alertes */}
      {showAlerts && (
        <div
          ref={alertsRef}
          className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-md shadow-lg overflow-hidden z-50"
        >
          {/* Contenu des alertes */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 px-1">
              {t('navbar.alerts', 'Alertes récentes')}
            </h3>
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-400 px-1">
                {t('navbar.no_alerts', 'Aucune alerte')}
              </p>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg ${
                      !alert.read ? 'bg-gray-700' : 'bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start">
                      {getAlertIcon(alert.type)}
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-200">
                          {alert.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de connexion */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            setShowLoginModal(false);
            if (onLogin) onLogin();
          }}
          onNavigate={onNavigate}
        />
      )}
    </nav>
  );
}