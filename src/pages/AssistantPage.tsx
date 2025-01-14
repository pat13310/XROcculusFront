import React, { useState, useEffect } from 'react';
import { Wand2, ChevronRight, ChevronLeft, Usb, Wifi, AppWindow, User, LandPlot, AlertCircle, CheckCircle, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GradientHeader from '../components/GradientHeader';
import { ConnectionModalContent } from '../components/ConnectionModalContent';
import Modal from '../components/Modal'; // Import the Modal component

// Importation dynamique des images
import casqueUSB from '/images/casqueUSB.webp';
import casqueWIFI from '/images/casqueWIFI.webp';
import casqueApp from '/images/casqueUser.webp';
import casqueUser from '/images/casqueFinal.webp';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function AssistantPage() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [usbConnectionStatus, setUsbConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'failure'>('idle');
  const [wifiConnectionStatus, setWifiConnectionStatus] = useState<"connecting" | "success" | "failure" | "idle">("idle");
  const [showUsbModal, setShowUsbModal] = useState(false);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [username, setUsername] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [wifiPassword, setWifiPassword] = useState('');
  const [showWifiSuccessModal, setShowWifiSuccessModal] = useState(false);

  interface AssistantStep {
    title: string;
    description: string;
    icon?: React.ReactNode;
    image?: string;
  }

  const assistantSteps: AssistantStep[] = [
    {
      title: t('assistant.welcome', 'Bienvenue dans votre Assistant XR'),
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

  const simulateUsbConnection = () => {
    setShowUsbModal(true); // Forcer l'affichage de la modale
    setUsbConnectionStatus('connecting');
    setTimeout(() => {
      // Simulation aléatoire de succès ou d'échec (pour le test)
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

  const simulateWifiConnection = () => {
    setShowWifiModal(true); // Forcer l'affichage de la modale
    if (!isValidIpAddress(wifiPassword)) {
      setWifiConnectionStatus('failure');
      return;
    }

    setWifiConnectionStatus('connecting');

    setTimeout(() => {
      // Simulation de la connexion avec une adresse IP
      const connectionSuccessful =Math.random() > 0.3;

      if (connectionSuccessful) {
        setWifiConnectionStatus('success');
        sleep(1000).then(() => {
          setShowWifiModal(false);
          // Afficher la modale de succès WiFi
          setShowWifiSuccessModal(true);
        });
      } else {
        setWifiConnectionStatus('failure');
        setShowWifiSuccessModal(true);
        // Afficher un message d'erreur dans la modale
      }
    }, 2000);
  };

  
  const setStep = (step: number) => {
    switch (step) {
      case 0:
        // Connexion USB
        simulateUsbConnection();
        break;
      case 1:
        // Lance le test de connexion WiFi
        simulateWifiConnection();
        break;
      case 2:
        // Gestion des utilisateurs - Demande de nom d'utilisateur
        setShowUsernameModal(true);
        break;
      case 3:
        // Étape finale
        finishSetup();
        break;
    }
  };

  const handleNext = () => {
  
        // Pour toutes les autres étapes, progression normale
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
                  // Passer à l'étape WiFi uniquement si la connexion USB est un succès
                  setCurrentStep(1);
                }
              }}
              onRetry={simulateUsbConnection}
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
              onClick={simulateWifiConnection}
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
              setCurrentStep(currentStep + 1); // Aller à l'étape suivante
            }
          }}
          onRetry={() => {
            setShowWifiSuccessModal(false);
            simulateWifiConnection();
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 overflow-hidden">
       <GradientHeader
          titleKey="assistant.title"
          defaultTitle="Assistant de connexion"
          Icon={Wand2} />

      <div className="container md:mx-16  px-0 py-0 max-w-3xl">
       
        {renderUsbConnectionModal()}
        {renderWifiConnectionModal()}
        {renderWifiSuccessModal()}
        {renderUsernameModal()}
        {renderCompletionModal()}

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
          <div><p className="text-gray-500 mb-6">{currentStepData.description}</p>
          </div>

          {currentStep === 1}

          <div className="flex justify-between">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center text-violet-500 hover:text-violet-700"
              >
                <ChevronLeft className="mr-2" /> {t('assistant.previous', 'Précédent')}
              </button>
            )}

            {currentStep < assistantSteps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center ml-auto text-violet-500 hover:text-violet-700 py-2 "
              >
                {t('assistant.next', 'Suivant')} <ChevronRight className="ml-2" />
              </button>
            ) : (
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
