import React, { useState } from 'react';
import { Wand2, ChevronRight, ChevronLeft, Usb, Wifi, AppWindow, User, LandPlot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GradientHeader from '../components/GradientHeader';

// Importation dynamique des images
import casqueUSB from '/images/casqueUSB.webp';
import casqueWIFI from '/images/casqueWIFI.webp';
import casqueApp from '/images/casqueUser.webp';
import casqueUser from '/images/casqueFinal.webp';

export function AssistantPage() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

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

  const handleNext = () => {
    if (currentStep < assistantSteps.length - 1) {
      handleActionStep(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleActionStep = (currentStep: number) => {
    // Logique de traitement de l'action
    if (currentStep === 0) {
      // Logique de connexion USB
    }
    if (currentStep === 1) {
      // Logique de connexion sans fil
    }
    if  (currentStep === 2) {
      // Logique de gestion des applications
    }
    if  (currentStep === 3) {
      // Logique de configuration complète
    }
  };

  const currentStepData = assistantSteps[currentStep];

  return (
    <div className="container mx-auto px-0 py-0 max-w-2xl">
      <GradientHeader
        titleKey="assistant.title"
        defaultTitle="Assistant de connexion"
        Icon={Wand2} />
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
              onClick={() => {/* Logique de fin de l'assistant */ }}
              className="bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600"
            >
              {t('assistant.finish', 'Terminer')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
