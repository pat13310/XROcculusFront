import React, { useState } from 'react';
import { AppGrid } from '../components/applications/AppGrid';
import { AppFilters } from '../components/applications/AppFilters';
import { Box, Search } from 'lucide-react';
import { useApps } from '../hooks/useApps';
import { LoadingScreen } from '../components/LoadingScreen';
import { useTranslation } from '../contexts/TranslationContext';
import GradientHeader from '../components/GradientHeader';

export function Applications() {
  const { apps, loading } = useApps();
  const [filter, setFilter] = useState<'all' | 'installed' | 'available'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  if (loading) {
    return <LoadingScreen message={t('apps.loading', 'Chargement des applications...')} />;
  }

  const filteredApps = apps.filter(app => {
    // Recherche uniquement sur le début du nom de l'application
    const matchesSearch = app.name.toLowerCase().startsWith(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'installed') return app.installed;
    return !app.installed;
  });

  return (
    <div className="space-y-4">
      {/* En-tête avec dégradé */}
      <GradientHeader
        titleKey="apps.title"
        defaultTitle="Bibliothèque d'applications"
        Icon={Box}
      />

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('apps.search_placeholder', 'Rechercher une application par son nom...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
          />
        </div>
        <AppFilters currentFilter={filter} onFilterChange={setFilter} />
      </div>

      {/* Grille d'applications */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('apps.no_results', 'Aucune application trouvée')}
          </h3>
          <p className="text-gray-500">
            {t('apps.try_different', 'Essayez une recherche différente ou modifiez les filtres')}
          </p>
        </div>
      ) : (
        <AppGrid apps={filteredApps} filter={filter} />
      )}
    </div>
  );
}