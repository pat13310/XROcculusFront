import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Device } from '../types';

export function useDevice(deviceId: string) {
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDevice() {
      try {
        const { data, error } = await supabase
          .from('devices')
          .select('*')
          .eq('id', deviceId)
          .single();

        if (error) throw error;
        if (mounted) setDevice(data);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Impossible de charger le dispositif'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDevice();

    const deviceSubscription = supabase
      .channel('device-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'devices',
        filter: `id=eq.${deviceId}`
      }, loadDevice)
      .subscribe();

    return () => {
      mounted = false;
      deviceSubscription.unsubscribe();
    };
  }, [deviceId]);

  return { device, loading, error };
}