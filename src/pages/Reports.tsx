import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, AlertCircle, Filter } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { supabase } from '../lib/supabase';
import { createLogger } from '../utils/logger';
import { LoadingScreen } from '../components/LoadingScreen';
import GradientHeader from '../components/GradientHeader';

const logger = createLogger('Reports');

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'device' | 'usage' | 'performance' | 'custom';
  config: Record<string, any>;
}

interface GeneratedReport {
  id: string;
  template_id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data: Record<string, any> | null;
  created_at: string;
  completed_at: string | null;
}

interface SupabaseResponse<T> {
  data: T[] | null;
  error: any;
}

export function Reports() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);

        // Charger les modèles de rapport
        const { data: templatesData, error: templatesError }: SupabaseResponse<ReportTemplate> = await supabase
          .from('report_templates')
          .select('*');

        if (templatesError) throw templatesError;

        // Charger les rapports générés
        const { data: reportsData, error: reportsError }: SupabaseResponse<GeneratedReport> = await supabase
          .from('generated_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (reportsError) throw reportsError;

        setTemplates(templatesData || []);
        setReports(reportsData || []);
      } catch (err) {
        logger.error('Erreur lors du chargement des rapports:');
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des rapports');
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  if (loading) {
    return <LoadingScreen message={t('reports.loading', 'Chargement des rapports...')} />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec dégradé */}
      <GradientHeader
        titleKey="reports.title"
        defaultTitle="Rapports"
        Icon={FileText}
      />

      {/* Filtres */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-sm border-0 focus:ring-0 text-gray-600 bg-transparent"
          >
            <option value="all">Tous les types</option>
            <option value="device">Appareils</option>
            <option value="usage">Utilisation</option>
            <option value="performance">Performance</option>
            <option value="custom">Personnalisé</option>
          </select>
        </div>

        <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Planifier un rapport</span>
        </button>
      </div>

      {/* Grille des rapports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${template.type === 'device' ? 'bg-blue-100 text-blue-700' :
                  template.type === 'usage' ? 'bg-green-100 text-green-700' :
                    template.type === 'performance' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                }`}>
                {template.type}
              </span>
            </div>

            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 text-sm bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition-colors duration-200 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Générer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Liste des rapports générés */}
      {reports.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rapports récents</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(report.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${report.status === 'completed' ? 'bg-green-100 text-green-700' :
                      report.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        report.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                    }`}>
                    {report.status === 'completed' ? 'Terminé' :
                      report.status === 'processing' ? 'En cours' :
                        report.status === 'failed' ? 'Échoué' :
                          'En attente'}
                  </span>
                  {report.status === 'completed' && (
                    <button className="p-2 text-gray-500 hover:text-violet-600 transition-colors duration-200">
                      <Download className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}