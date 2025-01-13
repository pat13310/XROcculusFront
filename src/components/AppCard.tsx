import React from 'react';
import { Download, Trash2, Star } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { formatBytes } from '../utils/formatters';
import { DefaultAppImage } from './applications/DefaultAppImage';
import type { Application } from '../types';

interface AppCardProps {
  app: Application;
  onInstall: (id: string) => void;
  onUninstall: (id: string) => void;
}

export function AppCard({ app, onInstall, onUninstall }: AppCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col h-full">
      <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
        {app.thumbnail ? (
          <img 
            src={app.thumbnail} 
            alt={app.name}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const defaultImage = e.currentTarget.parentElement?.querySelector('.default-app-image');
              if (defaultImage) {
                defaultImage.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div 
          className={`default-app-image w-full h-48 rounded-lg ${app.thumbnail ? 'hidden' : ''}`}
        >
          <DefaultAppImage 
            name={app.name}
            category={app.category}
            className="w-full h-full rounded-lg"
          />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{app.name}</h3>
              <p className="text-sm text-gray-600">
                {t('apps.card.by', 'by')} {app.developer}
              </p>
            </div>
            <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium text-yellow-700" title={t('apps.card.rating', 'Rating')}>
                {app.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{app.description}</p>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span title={t('apps.card.size', 'Size')}>{formatBytes(app.size)}</span>
            <span title={t('apps.card.version', 'Version')}>v{app.version}</span>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t">
          <button
            onClick={() => app.installed ? onUninstall(app.id) : onInstall(app.id)}
            disabled={app.installing}
            className={`w-full px-4 py-2 rounded-lg flex items-center justify-center ${
              app.installed 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
            } ${app.installing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {app.installing ? (
              <span>{t('apps.installing', 'Installing...')}</span>
            ) : app.installed ? (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {t('apps.uninstall', 'Uninstall')}
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                {t('apps.install', 'Install')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}