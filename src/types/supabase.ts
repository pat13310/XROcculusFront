export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      devices: {
        Row: {
          id: string
          name: string
          model: string
          status: 'online' | 'offline'
          battery_level: number
          storage_used: number
          storage_total: number
          last_sync: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['devices']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['devices']['Insert']>
      }
      available_apps: {
        Row: {
          id: string
          name: string
          developer: string
          size: number
          version: string
          thumbnail: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['available_apps']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['available_apps']['Insert']>
      }
      device_apps: {
        Row: {
          id: string
          device_id: string
          app_id: string
          installed_at: string
          status: 'installed' | 'installing' | 'uninstalling' | 'failed'
        }
        Insert: Omit<Database['public']['Tables']['device_apps']['Row'], 'id' | 'installed_at'>
        Update: Partial<Database['public']['Tables']['device_apps']['Insert']>
      }
    }
  }
}