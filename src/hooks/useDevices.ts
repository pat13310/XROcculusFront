import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { createLogger } from '../utils/logger';
import type { Database } from '../types/supabase';
import type { DeviceStats, Device } from '../types';

const logger = createLogger('useDevices');

type DeviceRow = Database['public']['Tables']['devices']['Row'];

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [stats, setStats] = useState<DeviceStats>({
    totalDevices: 0,
    activeDevices: 0,
    storageUsed: 0,
    batteryLevels: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDevices() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('devices')
          .select('*');

        if (error) {
          logger.warn('Failed to load devices', { error });
          return;
        }
        
        if (isMounted && data && data.length > 0) {
          // Transform the data to match the Device type
          const transformedDevices: Device[] = data.map((d: DeviceRow) => ({
            id: d.id,
            name: d.name || 'Unknown Device',
            model: d.model || 'N/A',
            status: d.status || 'offline',
            batteryLevel: d.battery_level ?? 0,
            storageUsed: d.storage_used ?? 0,
            storageTotal: d.storage_total ?? 0,
            lastSync: d.last_sync || new Date().toISOString()
          }));

          logger.debug('Devices loaded', { 
            count: transformedDevices.length,
            devices: transformedDevices.map(d => ({
              id: d.id,
              name: d.name,
              battery: d.batteryLevel,
              storage: `${Math.round((d.storageUsed / d.storageTotal) * 100)}%`
            }))
          });
          
          setDevices(transformedDevices);
          updateStats(transformedDevices);
        }
      } catch (error) {
        logger.error('Error loading devices:', error);
        setError(error instanceof Error ? error : new Error('Impossible de charger les appareils'));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    function updateStats(data: Device[]) {
      if (!isMounted) return;
      
      const stats = {
        totalDevices: data.length,
        activeDevices: data.filter(d => d.status === 'online').length,
        storageUsed: data.reduce((acc, device) => acc + device.storageUsed, 0),
        batteryLevels: data.map(d => d.batteryLevel),
      };

      logger.debug('Updated device stats', stats);
      setStats(stats);
    }

    loadDevices();

    const devicesSubscription = supabase
      .channel('devices-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, loadDevices)
      .subscribe();

    return () => {
      isMounted = false;
      devicesSubscription.unsubscribe();
    };
  }, []);

  return { devices, stats, loading, error };
}