import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Wand2, ChevronRight, ChevronLeft, Usb, Wifi, User, LandPlot, AlertCircle, CheckCircle, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GradientHeader from '../components/GradientHeader';
import { ConnectionModalContent } from '../components/ConnectionModalContent';
import Modal from '../components/Modal'; 
import { mqttService, MqttMessage } from '../services/mqtt';
import { useMqtt } from '../hooks/useMqtt'; 
import { createLogger } from '../utils/logger';

const logger = createLogger('AssistantPage');

// Importation dynamique des images
import casqueUSB from '/images/casqueUSB.webp';
import casqueWIFI from '/images/casqueWIFI.webp';
import casqueApp from '/images/casqueUser.webp';
import casqueUser from '/images/casqueFinal.webp';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MAX_MESSAGES = 50; // Nombre maximum de messages à conserver par topic

export function AssistantPage() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [usbConnectionStatus, setUsbConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'failure'|'disconnecting'>('idle');
  const [wifiConnectionStatus, setWifiConnectionStatus] = useState<"connecting" | "success" | "failure" | "idle">("idle");
  const [showUsbModal, setShowUsbModal] = useState(false);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [username, setUsername] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [wifiPassword, setWifiPassword] = useState('');
  const [showWifiSuccessModal, setShowWifiSuccessModal] = useState(false);
  const [mqttStatus, setMqttStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');

  // État pour les messages MQTT avec useRef pour éviter les re-renders inutiles
  const [mqttMessages, setMqttMessages] = useState<Record<string, string[]>>({
    'device/status': [],
    'device/config': [],
    'device/data': [],
    'device/infos': []
  });

  // Référence pour accéder aux derniers messages dans les callbacks
  const mqttMessagesRef = useRef(mqttMessages);
  useEffect(() => {
    mqttMessagesRef.current = mqttMessages;
  }, [mqttMessages]);

  // Fonction pour mettre à jour les messages de manière optimisée
  const updateMessages = useCallback((topic: string, message: MqttMessage) => {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${messageStr}`;

    setMqttMessages(prev => {
      const currentMessages = prev[topic] || [];
      const updatedMessages = [...currentMessages, formattedMessage];
      
      // Garder seulement les MAX_MESSAGES plus récents
      if (updatedMessages.length > MAX_MESSAGES) {
        return {
          ...prev,
          [topic]: updatedMessages.slice(-MAX_MESSAGES)
        };
      }

      return {
        ...prev,
        [topic]: updatedMessages
      };
    });

    logger.info('Message MQTT mis à jour', { topic, message: formattedMessage });
  }, []);

  // Utiliser le hook useMqtt
  const { mqttStatus: hookMqttStatus, messages } = useMqtt(
    wifiPassword ? `ws://${wifiPassword}:9001` : undefined,
    [
      'device/status',
      'device/config',
      'device/data',
      'device/infos'
    ]
  );

  // Observer les messages reçus avec useCallback
  useEffect(() => {
    if (!messages) return;

    Object.entries(messages).forEach(([topic, message]) => {
      logger.info('Message reçu dans AssistantPage', { topic, message });
      
      // Gérer les messages device/infos
      if (topic === 'device/infos') {
        const status = typeof message === 'string' ? message : JSON.stringify(message);
        if (status === 'connected') {
          setUsbConnectionStatus('success');
        } else if (status === 'disconnected') {
          setUsbConnectionStatus('disconnecting');
        }
        else{
          setUsbConnectionStatus('idle');
        }
      }
      
      updateMessages(topic, message);
    });
  }, [messages, updateMessages]);

  // Mettre à jour le statut MQTT
  useEffect(() => {
    setMqttStatus(hookMqttStatus);
  }, [hookMqttStatus]);

  // Fonction pour effacer les messages d'un topic
  const clearTopicMessages = useCallback((topic: string) => {
    setMqttMessages(prev => ({
      ...prev,
      [topic]: []
    }));
    logger.info('Messages effacés pour le topic', { topic });
  }, []);

  interface AssistantStep {
    title: string;
    description: string;
    icon?: React.ReactNode;
    image?: string;
  }

  const assistantSteps: AssistantStep[] = [
    {
      title: t('assistant.welcome', 'Bienvenue dans votre Assistant'),
      description: t('assistant.welcome_desc', 'Connecter d\'abord votre casque via le port USB.'),
      icon: <Usb className="w-6 h-6 text-indigo-500" />,
      image: casqueUSB,
    },
    {
      title: t('assistant.device_management', 'Gestion des Appareils'),
      description: t('assistant.device_management_desc', 'Maintenant la connexion sans fil va démarrer.'),
      icon: <Wifi className="w-6 h-6 text-indigo-500" />,
      image: casqueWIFI,
    },
    {
      title: t('assistant.applications', 'Informations utilisateur'),
      description: t('assistant.applications_desc', 'Entrer le nom utilisateur qui sera associé à ce casque.'),
      icon: <User className="w-6 h-6 text-indigo-500" />,
      image: casqueApp,
    },
    {
      title: t('assistant.complete', 'Configuration Terminée'),
      description: t('assistant.complete_desc', 'Félicitations ! Vous êtes maintenant prêt à utiliser votre casque XR.'),
      icon: <LandPlot className="w-6 h-6 text-indigo-500" />,
      image: casqueUser,
    }
  ];

  const executeUsbConnection = () => {
    setShowUsbModal(true); 
    setUsbConnectionStatus('connecting');
    setTimeout(() => {
      const connectionSuccessful = Math.random() > 0.3;

      if (connectionSuccessful) {
        setUsbConnectionStatus('success');
        sleep(1000).then(() => {
          setCurrentStep(1);
        });
      } else {
        setUsbConnectionStatus('failure');
      }
    }, 3000);
  };

  const executeWifiConnection = async () => {
    console.log('Début executeWifiConnection');
    setShowWifiModal(true);
    if (!isValidIpAddress(wifiPassword)) {
      console.log('Adresse IP invalide:', wifiPassword);
      setWifiConnectionStatus('failure');
      return;
    }

    setWifiConnectionStatus('connecting');
    
    // Le hook useMqtt gère maintenant la connexion automatiquement
    // quand l'adresse IP change
  };

  const setStep = (step: number) => {
    switch (step) {
      case 0:
        executeUsbConnection();
        break;
      case 1:
        executeWifiConnection();
        break;
      case 2:
        setShowUsernameModal(true);
        break;
      case 3:
        finishSetup();
        break;
    }
  };

  const handleNext = () => {  
    if (currentStep < assistantSteps.length - 1) {          
      setStep(currentStep );
    }    
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

 
  const renderUsbConnectionModal = () => {
    if (!showUsbModal) return null;

    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md">
          <div className="relative flex flex-col w-full bg-white border-1 rounded-lg shadow-lg outline-none focus:outline-none">
            <ConnectionModalContent
              status={usbConnectionStatus}
              type="usb"
              onContinue={() => {
                if (usbConnectionStatus === 'success') {
                  setShowUsbModal(false);
                  setCurrentStep(1);
                }
              }}
              onRetry={executeUsbConnection}
              onCancel={() => setShowUsbModal(false)} />
          </div>
        </div>
      </div>
    );
  };

  const isValidIpAddress = (ip: string) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(ip)) return false;

    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  };

  const renderWifiConnectionModal = () => {
    if (!showWifiModal) return null;

    return (
      <Modal
        isOpen={showWifiModal}
        onClose={() => setShowWifiModal(false)}
        className="max-w-md"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">{t('wifi.select_network', 'Saisissez une adresse IP')}</h2>

          <div className="mt-4">
            <input
              type="text"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              placeholder={t('wifi.enter_password', 'Votre adresse IP')}
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setShowWifiModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              {t('common.cancel', 'Annuler')}
            </button>
            <button
              onClick={executeWifiConnection}
              disabled={!isValidIpAddress(wifiPassword)}
              className={`px-4 py-2 rounded ${isValidIpAddress(wifiPassword)
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {t('wifi.connect', 'Connecter')}
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const renderWifiSuccessModal = () => {
    if (!showWifiSuccessModal) return null;

    return (
      <Modal
        isOpen={showWifiSuccessModal}
        onClose={() => setShowWifiSuccessModal(false)}
        className="max-w-sm"
      >
        <ConnectionModalContent
          status={wifiConnectionStatus}
          type="wifi"
          onContinue={() => {
            if (wifiConnectionStatus === 'success') {
              setShowWifiSuccessModal(false);
              setCurrentStep(currentStep + 1); 
            }
          }}
          onRetry={() => {
            setShowWifiSuccessModal(false);
            executeWifiConnection();
          }}
          onCancel={() => setShowWifiSuccessModal(false)}
        />
      </Modal>
    );
  };

  const renderUsernameModal = () => {
    if (!showUsernameModal) return null;

    return (
      <Modal
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        className="max-w-md"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">{t('assistant.enter_username', 'Entrez votre nom d\'utilisateur')}</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t('assistant.username_placeholder', 'Nom d\'utilisateur')}
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-between">
            <button
              onClick={() => {
                setShowUsernameModal(false);
                setCurrentStep(3);
              }}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              {t('common.continue', 'Continuer')}
            </button>
            <button
              onClick={() => setShowUsernameModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              {t('common.cancel', 'Annuler')}
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const renderCompletionModal = () => {
    if (!showCompletionModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="w-full max-w-sm mx-auto">
          <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-4">{t('assistant.device_associated', 'Casque Associé')}</h2>
            <p className="mb-4">{t('assistant.device_associated_desc', 'L\'utilisateur {username} a été bien associé à ce casque.', { username })}</p>
            <button
              onClick={() => setShowCompletionModal(false)}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 mx-auto"
            >
              {t('common.close', 'Fermer')}
            </button>
          </div>
        </div>
      </div>
    );
  };


  const finishSetup = () => {
    setShowCompletionModal(true);
  };

  const currentStepData = assistantSteps[currentStep];

  const connectToMqtt = async () => {
    try {
      await mqttService.connect('ws://localhost:9001'); 
      setMqttStatus('connected');
      
      mqttService.subscribe('device/status', (message: MqttMessage) => {
        console.log('Device status:', message);
      });

      mqttService.subscribe('device/connection', (message: MqttMessage) => {
        console.log('Device connection:', message);
      });

    } catch (error) {
      setMqttStatus('error');
      const errorRecord = error instanceof Error 
        ? { message: error.message, name: error.name }
        : { message: String(error) };
      console.error('Erreur de connexion MQTT:', errorRecord);
    }
  };

  useEffect(() => {
    connectToMqtt();

    return () => {
      mqttService.disconnect();
    };
  }, []); 

  const renderStepContent = (step: AssistantStep) => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              {usbConnectionStatus === 'success' && (
                <div className="text-green-600 font-medium flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>USB connecté avec le casque</span>
                </div>
              )}
              {usbConnectionStatus === 'disconnecting' && (
                <div className="text-orange-600 font-medium flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Casque déconnecté</span>
                </div>
              )}
              {usbConnectionStatus === 'idle' && (
                <div className="text-gray-600">
                  Connecter d'abord votre casque via le port USB
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <div className="text-gray-600">
                {currentStepData.description}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 ">
       <GradientHeader
          titleKey="assistant.title"
          defaultTitle="Assistant de connexion"
          Icon={Wand2}
          rightContent={
            <div className="flex items-center h-full">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                mqttStatus === 'connected' ? 'bg-green-500' :
                mqttStatus === 'error' ? 'bg-red-500' :
                'bg-gray-500'
              }`} />
              <span className="text-sm text-gray-600">
                {mqttStatus === 'connected' ? t('server.status.connected', 'Serveur Connecté') :
                 mqttStatus === 'error' ? t('server.status.error', 'Erreur du serveur') :
                 t('server.status.disconnected', 'Serveur Déconnecté')}
              </span>
            </div>
          } />

      <div className="container md:mx-16  px-0 py-0 max-w-3xl">       
        {renderUsbConnectionModal()}
        {renderWifiConnectionModal()}
        {renderWifiSuccessModal()}
        {renderUsernameModal()}
        {renderCompletionModal()}

        {mqttStatus === 'connected' && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Messages MQTT</h2>
            <div className="space-y-4">
              {Object.entries(mqttMessages).map(([topic, messages]) => (
                <div key={topic} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-blue-600">{topic}</h3>
                    <button
                      onClick={() => clearTopicMessages(topic)}
                      className="text-sm text-gray-500 hover:text-red-500"
                    >
                      Effacer
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {messages.map((msg, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                        {msg}
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-gray-500 italic">
                        Aucun message reçu
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg p-2 text-center">
          <div className="flex flex-col items-center mb-3">
            {currentStepData.image && (
              <img
                src={currentStepData.image}
                alt={currentStepData.title}
                className="max-w-full h-auto object-contain mb-4 rounded-lg"
                onError={(e) => {
                  console.error('Image failed to load', e);
                  console.log('Image source:', currentStepData.image);
                }}
              />
            )}
            <div className="flex flex-row items-center justify-center space-x-3 mb-2">
              {currentStepData.icon && <div className="text-xs">{currentStepData.icon}</div>}
              <h2 className="text-xl font-bold text-gray-600">{currentStepData.title}</h2>
            </div>
          </div>
          {renderStepContent(currentStepData)}
          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center text-violet-500 hover:text-violet-700 py-2"
              >
                <ChevronLeft className="mr-2" /> {t('assistant.previous', 'Précédent')}
              </button>
            )}

            {currentStep < assistantSteps.length - 1 && (
              <button
                onClick={handleNext}
                disabled={usbConnectionStatus !== 'success'}
                className={`flex items-center ml-auto py-2 ${
                  usbConnectionStatus === 'success'
                    ? 'text-violet-500 hover:text-violet-700'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {t('assistant.next', 'Suivant')} <ChevronRight className="ml-2" />
              </button>
            )}

            {currentStep === assistantSteps.length - 1 && (
              <button
                onClick={finishSetup}
                className="bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600"
              >
                {t('assistant.finish', 'Terminer')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
