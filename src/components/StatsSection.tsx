import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { TrendingUp, Shield, Clock } from 'lucide-react';

export function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: TrendingUp,
      value: '475+',
      label: t('landing.stats.devices_managed', 'Appareils Gérés'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Shield,
      value: '95.9%',
      label: t('landing.stats.uptime', 'Temps de Disponibilité'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Clock,
      value: '24/7',
      label: t('landing.stats.support', 'Support Client'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            {t('landing.stats.title', 'Notre Impact')}
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            {t('landing.stats.subtitle', 'Des chiffres qui montrent notre engagement envers la gestion des appareils VR')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <p className={`text-5xl font-bold ${stat.color} drop-shadow-sm`}>
                    {stat.value}
                  </p>
                </div>
                <p className="text-lg font-medium text-gray-700 text-center">
                  {stat.label}
                </p>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-violet-900 opacity-70"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
