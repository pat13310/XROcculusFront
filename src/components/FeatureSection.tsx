import { Shield, Zap, Users } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

export function FeatureSection() {
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
    <section id="features" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            {t('landing.features.title', 'Nos Fonctionnalités Clés')}
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            {t('landing.features.subtitle', 'Découvrez comment notre plateforme simplifie la gestion de vos appareils VR')}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover absolute inset-0 transform hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
                <div className="absolute bottom-4 left-4 flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <feature.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  {feature.description}
                </p>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-violet-900 opacity-70"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
