import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { createLogger } from '../utils/logger';
import type { Database } from '../types/supabase';
import type { DeviceStats, Device } from '../types';

const logger = createLogger('useDevices');

type DeviceRow = Database['public']['Tables']['devices']['Row'];

// Mock data for fallback
const MOCK_DEVICES: Device[] = [
  {
    id: '1',
    name: 'Meta Quest 3',
    model: 'MQ3-128',
    status: 'online',
    batteryLevel: 85,
    storageUsed: 95000000000,
    storageTotal: 128000000000,
    lastSync: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Meta Quest Pro',
    model: 'MPR-256',
    status: 'online',
    batteryLevel: 72,
    storageUsed: 156000000000,
    storageTotal: 256000000000,
    lastSync: new Date().toISOString()
  }
];

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [stats, setStats] = useState<DeviceStats>({
    totalDevices: MOCK_DEVICES.length,
    activeDevices: MOCK_DEVICES.filter(d => d.status === 'online').length,
    storageUsed: MOCK_DEVICES.reduce((acc, d) => acc + d.storageUsed, 0),
    batteryLevels: MOCK_DEVICES.map(d => d.batteryLevel)
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDevices() {
      try {
        const { data, error } = await supabase
          .from('devices')
          .select('*');

        if (error) {
          logger.warn('Failed to load devices, using mock data', { error });
          return;
        }
        
        if (isMounted && data && data.length > 0) {
          // Transform the data to match the Device type
          const transformedDevices: Device[] = data.map((d: DeviceRow) => ({
            id: d.id,
            name: d.name,
            model: d.model,
            status: d.status,
            batteryLevel: d.battery_level,
            storageUsed: d.storage_used,
            storageTotal: d.storage_total,
            lastSync: d.last_sync
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

  return { devices, stats, loading };
}