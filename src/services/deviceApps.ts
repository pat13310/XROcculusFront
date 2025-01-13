import { supabase } from '../lib/supabase';

export async function installApp(deviceId: string, appId: string) {
  try {
    const { error } = await supabase
      .from('device_apps')
      .insert({
        device_id: deviceId,
        app_id: appId,
        status: 'installing'
      });

    if (error) throw error;

    // Simulate installation completion
    setTimeout(async () => {
      await supabase
        .from('device_apps')
        .update({ status: 'installed' })
        .eq('device_id', deviceId)
        .eq('app_id', appId);
    }, 2000);
  } catch (error) {
    console.error('Error installing app:', error);
    throw error;
  }
}

export async function uninstallApp(deviceId: string, appId: string) {
  try {
    const { error } = await supabase
      .from('device_apps')
      .update({ status: 'uninstalling' })
      .eq('device_id', deviceId)
      .eq('app_id', appId);

    if (error) throw error;

    // Simulate uninstallation completion
    setTimeout(async () => {
      await supabase
        .from('device_apps')
        .delete()
        .eq('device_id', deviceId)
        .eq('app_id', appId);
    }, 2000);
  } catch (error) {
    console.error('Error uninstalling app:', error);
    throw error;
  }
}