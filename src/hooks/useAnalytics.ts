import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { createLogger } from '../utils/logger';
import type { NetworkMetric, DataUsage, BatteryStats, AppStats, ConsoleStorage } from '../types/analytics';

const logger = createLogger('useAnalytics');

const MOCK_DATA = {
  appStats: [
    {
      app_name: 'Beat Saber',
      user_count: 245,
      total_bytes: 2500000000
    },
    {
      app_name: 'Half-Life: Alyx',
      user_count: 180,
      total_bytes: 6700000000
    },
    {
      app_name: 'Population: One',
      user_count: 156,
      total_bytes: 1200000000
    }
  ],
  consoleStorage: [
    {
      model: 'Meta Quest 3',
      device_count: 156,
      total_storage: 128000000000,
      used_storage: 89600000000
    },
    {
      model: 'Meta Quest Pro',
      device_count: 89,
      total_storage: 256000000000,
      used_storage: 153600000000
    },
    {
      model: 'Pico 4',
      device_count: 45,
      total_storage: 256000000000,
      used_storage: 179200000000
    }
  ]
};

export function useAnalytics() {
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetric[]>([]);
  const [dataUsage, setDataUsage] = useState<DataUsage[]>([]);
  const [batteryStats, setBatteryStats] = useState<BatteryStats[]>([]);
  const [appStats, setAppStats] = useState<AppStats[]>(MOCK_DATA.appStats);
  const [consoleStorage, setConsoleStorage] = useState<ConsoleStorage[]>(MOCK_DATA.consoleStorage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadAnalytics() {
      try {
        logger.debug('Loading analytics data');
        setLoading(true);
        setError(null);

        // Load app usage stats
        const { data: appStatsData, error: appStatsError } = await supabase
          .from('app_usage_stats')
          .select('*')
          .order('user_count', { ascending: false });

        if (appStatsError) {
          logger.warn('Failed to load app stats, using mock data', { error: appStatsError });
        } else if (appStatsData && appStatsData.length > 0) {
          setAppStats(appStatsData);
        }

        // Load console storage stats
        const { data: storageData, error: storageError } = await supabase
          .from('console_storage_stats')
          .select('*')
          .order('device_count', { ascending: false });

        if (storageError) {
          logger.warn('Failed to load storage stats, using mock data', { error: storageError });
        } else if (storageData && storageData.length > 0) {
          setConsoleStorage(storageData);
        }

        // Load network metrics
        const { data: networkData, error: networkError } = await supabase
          .from('network_metrics')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);

        if (networkError) {
          logger.warn('Failed to load network metrics', { error: networkError });
        } else if (networkData) {
          setNetworkMetrics(networkData);
        }

        // Load battery stats
        const { data: batteryData, error: batteryError } = await supabase
          .from('device_battery_stats')
          .select('*')
          .order('hour', { ascending: false })
          .limit(10);

        if (batteryError) {
          logger.warn('Failed to load battery stats', { error: batteryError });
        } else if (batteryData) {
          setBatteryStats(batteryData);
        }

        if (mounted) {
          logger.info('Analytics data loaded successfully');
        }
      } catch (err) {
        logger.error('Failed to load analytics data', { error: err });
        setError(err instanceof Error ? err : new Error('Failed to load analytics data'));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  return { networkMetrics, dataUsage, batteryStats, appStats, consoleStorage, loading, error };
}