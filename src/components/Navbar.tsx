import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Settings, Glasses, LogIn } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { supabase } from '../lib/supabase';
import { createLogger } from '../utils/logger';
import Button from './ui/Button';
import { FiLogOut } from 'react-icons/fi';

const logger = createLogger('Navbar');

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigate: (page: 'dashboard' | 'settings' | 'devices' | 'device-details' | 'analytics' | 'users' | 'reports' | 'applications') => void;
  currentPage: 'dashboard' | 'settings' | 'devices' | 'device-details' | 'analytics' | 'users' | 'reports' | 'applications';
  isAuthenticated: boolean;
  onSignOut: () => void;
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
  currentPage,
  isAuthenticated,
  onSignOut
}: NavbarProps) {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
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

  const handleDeviceDetails = (deviceId: string) => {
    onNavigate('device-details');
    // Vous pouvez également passer l'ID du device si nécessaire
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-4">
              <Glasses className="h-8 w-8 text-gray-900" />
              <span className="text-xl font-bold text-gray-900">
                {t('app.name', 'XR Oculus Manager')}
              </span>
            </div>            
        
            {/* Menu hamburger visible uniquement sur les écrans md et plus petits */}
            <button 
              onClick={onToggleSidebar} 
              className="md:hidden ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="ml-4 flex items-center space-x-4">
            {/* Conteneur pour les icônes de droite */}
            {isAuthenticated && (
              <div className="flex items-center space-x-3 mr-3">
                {/* Notifications */}
                <button 
                  ref={buttonRef}
                  onClick={() => setShowAlerts(!showAlerts)} 
                  className="text-gray-400 hover:text-gray-600 transition-colors relative"
                >
                  <Bell className="h-5 w-5" />
                  {alerts.filter(a => !a.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[0.6rem] rounded-full h-3.5 w-3.5 flex items-center justify-center">
                      {alerts.filter(a => !a.read).length}
                    </span>
                  )}
                </button>

                {/* Paramètres */}
                <button 
                  onClick={() => onNavigate('settings')} 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            )}
            
            {isAuthenticated ? (
              <Button 
                variant="gradient" 
                onClick={onSignOut}
                className="flex items-center"
              >
                <FiLogOut className="mr-2" />
                {t('navbar.signout', 'Se déconnecter')}
              </Button>
            ) : (
              <Button 
                variant="gradient" 
                onClick={() => onNavigate('dashboard')}
                className="flex items-center"
              >
                <LogIn className="mr-2 h-5 w-5" />
                {t('navbar.signin', 'Se connecter')}
              </Button>
            )}
          </div>
        </div>
      </div>
      {showAlerts && (
        <div 
          ref={alertsRef} 
          className="absolute right-0 top-full mt-2 w-64 bg-gray-800 rounded-md shadow-lg border border-gray-700"
        >
          {/* Contenu des alertes */}
          {alerts.length === 0 ? (
            <p className="text-xs text-gray-500 p-4 text-center">
              {t('navbar.no_alerts', 'Aucune nouvelle alerte')}
            </p>
          ) : (
            alerts.map(alert => (
              <div 
                key={alert.id} 
                className="p-3 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors"
              >
                <p className="text-xs text-gray-300">{alert.title}</p>
                <p className="text-[0.6rem] text-gray-500">{alert.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </nav>
  );
}