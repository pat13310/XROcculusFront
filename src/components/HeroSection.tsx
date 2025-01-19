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
    <div className="xl:py-24 relative overflow-hidden min-h-[80vh] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'url(/images/hero.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.85,
          filter: 'brightness(0.3) grayscale(0.7) hue-rotate(250deg) saturate(150%)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 via-purple-500/10 to-indigo-500/20 z-0" />
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
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
          style={{ 
            color: '#ec4899',
            WebkitTextStroke: '1px rgba(147, 51, 234, 0.5)',
            textShadow: '0 0 20px rgba(236, 72, 153, 0.3)'
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
