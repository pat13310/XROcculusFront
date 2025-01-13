import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

interface AppFiltersProps {
  currentFilter: 'all' | 'installed' | 'available';
  onFilterChange: (filter: 'all' | 'installed' | 'available') => void;
}

export function AppFilters({ currentFilter, onFilterChange }: AppFiltersProps) {
  const { t } = useTranslation();

  const filters = [
    { id: 'all', label: t('apps.filters.all', 'Toutes les apps') },
    { id: 'installed', label: t('apps.filters.installed', 'Installées') },
    { id: 'available', label: t('apps.filters.available', 'Disponibles') }
  ];

  return (
    <div className="flex space-x-2">
      {filters.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onFilterChange(id as 'all' | 'installed' | 'available')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            currentFilter === id
              ? 'bg-violet-100 text-violet-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}