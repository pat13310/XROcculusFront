import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Settings, Glasses } from 'lucide-react';
import { signOut } from '../lib/auth';
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
}: NavbarProps) {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const alertsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
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
  }, []);

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

  return (
    <header className="bg-gray-900 text-gray-100 sticky top-0 z-50">
      <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-4 flex justify-between items-center">
        {/* Logo et Titre */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={onToggleSidebar} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Glasses className="h-5 w-5 text-violet-400" />
            <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              {t('navbar.title', 'Gestionnaire VR')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 ">
          {/* Notifications */}
          <button 
            ref={buttonRef}
            onClick={() => setShowAlerts(!showAlerts)} 
            className="text-gray-400 hover:text-white transition-colors relative"
          >
            <Bell className="h-5 w-5" />
            {alerts.filter(a => !a.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[0.6rem] rounded-full h-3.5 w-3.5 flex items-center justify-center">
                {alerts.filter(a => !a.read).length}
              </span>
            )}
          </button>
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

          {/* Paramètres */}
          <button 
            onClick={() => onNavigate('settings')} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Déconnexion */}
          <Button 
            variant="gradient" 
            onClick={() => signOut()}
            className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
          >
            <FiLogOut className="h-4 w-4" />
            <span className="text-xs">{t('navbar.logout', 'Déconnexion')}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}