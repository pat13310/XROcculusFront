import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type DeviceApp = Database['public']['Tables']['device_apps']['Row'] & {
  app: Database['public']['Tables']['available_apps']['Row']
};

export function useDeviceApps(deviceId: string) {
  const [apps, setApps] = useState<DeviceApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeviceApps() {
      try {
        const { data, error } = await supabase
          .from('device_apps')
          .select(`
            *,
            app:available_apps(*)
          `)
          .eq('device_id', deviceId);

        if (error) throw error;
        setApps(data as DeviceApp[]);
      } catch (error) {
        console.error('Error loading device apps:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDeviceApps();

    const appsSubscription = supabase
      .channel('device-apps-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'device_apps',
        filter: `device_id=eq.${deviceId}`
      }, loadDeviceApps)
      .subscribe();

    return () => {
      appsSubscription.unsubscribe();
    };
  }, [deviceId]);

  return { apps, loading };
}