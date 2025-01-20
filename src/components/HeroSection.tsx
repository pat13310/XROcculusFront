import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { VRDeviceIllustration } from './VRDeviceIllustration';
import { useTranslation } from '../contexts/TranslationContext';

interface HeroSectionProps {
  handleOpenLoginModal: () => void;
}

export function HeroSection({ handleOpenLoginModal }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="xl:py-12 relative overflow-hidden min-h-[80vh] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'url(/images/hero.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.86,
          filter: 'blur(1px) brightness(0.3) grayscale(0.7) hue-rotate(250deg) saturate(150%)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/40 to-indigo-700/50 backdrop-blur-sm z-0" 
           style={{
             background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(147, 51, 234, 0.2) 50%, rgba(79, 70, 229, 0.2) 100%)',
             mixBlendMode: 'overlay'
           }}
      />
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.3,
            type: "spring",
            stiffness: 120
          }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight p-3"
          style={{ 
            background: 'linear-gradient(to right, #ec4899 20%, #8b5cf6 50%, #6366f1 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% auto',
            animation: 'gradient 3s linear infinite',
            textShadow: '0 0 20px rgba(236, 72, 153, 0.3)',
            WebkitTextStroke: '2px rgba(147, 51, 234, 0.8)'
          }}
        >
          {t('landing.hero.title', 'Gérez Vos Casques XR')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.5,
            type: "spring",
            stiffness: 80
          }}
          className="max-w-3xl mx-auto text-2xl text-gray-200 mb-12 font-medium tracking-wide"
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          {t('landing.hero.subtitle', 'Plateforme intelligente de gestion et sécurisation VR')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.7,
            type: "spring",
            stiffness: 80
          }}
          className="flex justify-center space-x-4 mb-16"
        >
          <Button 
            variant="gradient" 
            onClick={handleOpenLoginModal}
            className="px-8 py-3 text-lg"
          >
            {t('landing.hero.get_started', 'Commencer')}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <a 
            href="#features" 
            className="px-6 py-3 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>{t('landing.hero.learn_more', 'En Savoir Plus')}</span>
            <ArrowRight className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
