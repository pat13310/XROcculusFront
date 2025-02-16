import React from 'react';
import { CheckCircle, AlertCircle, Usb, Wifi, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ConnectionModalContentProps {
  status: 'connecting' | 'success' | 'failure' | 'idle'|'disconnecting';
  type: 'usb' | 'wifi';
  onContinue?: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
}

export const ConnectionModalContent: React.FC<ConnectionModalContentProps> = ({
  status,
  type,
  onContinue,
  onRetry,
  onCancel
}) => {
  const { t } = useTranslation();

  const getIcon = () => {
    switch (status) {
      case 'connecting':
        return type === 'usb' ?
          <Usb className="w-12 h-12 text-violet-500 animate-pulse" /> :
          <Wifi className="w-12 h-12 text-violet-500 animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'failure':
        return type === 'usb' ?
          <AlertCircle className="w-12 h-12 text-red-500" /> :
          <WifiOff className="w-12 h-12 text-red-500" />;
    }
  };

  const getConnectingText = () => {
    return type === 'usb'
      ? t('assistant.usb.connecting', 'Connexion USB en cours...')
      : t('assistant.wifi.connecting', 'Connexion WiFi en cours...');
  };

  const getSuccessText = () => {
    return type === 'usb'
      ? t('assistant.usb.success', 'Connexion USB réussie !')
      : t('assistant.wifi.success', 'Connexion WiFi réussie !');
  };

  const getFailureText = () => {
    return type === 'usb'
      ? t('assistant.usb.failure', 'Échec de la connexion USB.')
      : t('assistant.wifi.failure', 'Erreur de connexion.');
  };

  const getFailureDescription = () => {
    return type === 'usb'
      ? t('assistant.usb.failure_desc', 'Vérifiez votre câble et réessayez.')
      : t('assistant.wifi.failure_desc', 'Vérifiez votre réseau et réessayez.');
  };

  return (
    <div className="flex flex-col items-center p-4">
      {getIcon()}

      {status === 'connecting' && (
        <p className="mt-2 text-lg">{getConnectingText()}</p>
      )}

      {status === 'success' && (
        <>
          <p className="mt-2 text-lg text-green-600">{getSuccessText()}</p>
          <button
            onClick={onContinue}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {t('common.continue', 'Continuer')}
          </button>
        </>
      )}

      {status === 'failure' && (
        <>
          <p className="mt-2 text-lg text-red-600">{getFailureText()}</p>
          <p className="text-sm text-gray-600 mt-1">{getFailureDescription()}</p>
          <div className="flex justify-between mt-4 space-x-8">
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              {t('common.retry', 'Réessayer')}
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              {t('common.cancel', 'Annuler')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
