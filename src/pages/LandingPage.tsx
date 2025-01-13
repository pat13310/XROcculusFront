import React from 'react';
import { Glasses, Shield, Zap, Users, ChevronRight, ArrowRight } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { useTranslation } from '../contexts/TranslationContext';

export function LandingPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: t('landing.features.security.title', 'Sécurité Entreprise'),
      description: t('landing.features.security.description', 'Sécurité de niveau entreprise avec contrôle d\'accès basé sur les rôles et surveillance en temps réel.'),
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Zap,
      title: t('landing.features.monitoring.title', 'Surveillance en Temps Réel'),
      description: t('landing.features.monitoring.description', 'Surveillez l\'état des appareils, les niveaux de batterie et l\'utilisation du stockage en temps réel.'),
      image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Users,
      title: t('landing.features.collaboration.title', 'Collaboration d\'Équipe'),
      description: t('landing.features.collaboration.description', 'Collaboration d\'équipe transparente avec des autorisations granulaires et suivi des activités.'),
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-neutral-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <Glasses className="h-8 w-8 text-gray-900" />
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {t('landing.title', 'Gestionnaire de Périphériques VR')}
              </span>
            </div>
            <button 
              onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>{t('landing.sign_in', 'Se Connecter')}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
          {t('landing.hero.title', 'Gérez Vos Appareils VR')}
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-gray-600 mb-10">
          {t('landing.hero.subtitle', 'Une plateforme centralisée pour gérer, surveiller et sécuriser vos appareils de réalité virtuelle.')}
        </p>
        <div className="flex justify-center space-x-4 mb-16">
          <a 
            href="#features" 
            className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>{t('landing.hero.learn_more', 'En Savoir Plus')}</span>
            <ArrowRight className="h-5 w-5" />
          </a>
          <a 
            href="#login-section" 
            className="px-6 py-3 border border-gray-300 text-gray-900 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            {t('landing.hero.get_started', 'Commencer')}
          </a>
        </div>

        {/* Features Section */}
        <section id="features" className="grid md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <feature.icon className="h-12 w-12 mx-auto mb-4 text-gray-900" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Stats Section */}
      <div className="bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">
              {t('landing.stats.title', 'Notre Impact')}
            </h2>
            <p className="mt-4 text-gray-300">
              {t('landing.stats.subtitle', 'Des chiffres qui montrent notre engagement envers la gestion des appareils VR')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
            <div>
              <p className="text-5xl font-extrabold text-white mb-2">500+</p>
              <p className="text-gray-300">
                {t('landing.stats.devices_managed', 'Appareils Gérés')}
              </p>
            </div>
            <div>
              <p className="text-5xl font-extrabold text-white mb-2">99.9%</p>
              <p className="text-gray-300">
                {t('landing.stats.uptime', 'Temps de Disponibilité')}
              </p>
            </div>
            <div>
              <p className="text-5xl font-extrabold text-white mb-2">24/7</p>
              <p className="text-gray-300">
                {t('landing.stats.support', 'Support Client')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <section id="login-section" className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-white p-8 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">
            {t('landing.login.title', 'Connexion')}
          </h2>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-gray-600">
            {t('landing.login.no_account', "Vous n'avez pas de compte?")}
            {' '}
            <a href="#" className="text-gray-900 hover:text-gray-700 font-medium">
              {t('landing.login.contact_admin', 'Contactez votre administrateur')}
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                {t('footer.privacy_policy', 'Politique de Confidentialité')}
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                {t('footer.terms', 'Conditions d\'Utilisation')}
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                {t('footer.contact', 'Contact')}
              </a>
            </div>
            <p className="mt-8 text-base text-gray-500 md:mt-0 md:order-1">
              {t('footer.copyright', `© ${new Date().getFullYear()} XR Occulus. Tous droits réservés.`)}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}