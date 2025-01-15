// src/services/apiClient.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import { getConfig } from '../config/appConfig'; // Importer depuis un fichier de configuration

// Type générique pour la réponse
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Créer l'instance Axios de manière dynamique
function createAxiosInstance(): AxiosInstance {
  const config = getConfig();
  
  return axios.create({
    baseURL: config.apiBaseUrl,
    timeout: config.apiTimeout || 10000,
    headers: {
      'Content-Type': 'application/json',
      ...config.apiHeaders
    }
  });
}

// Fonction générique pour les appels API
export async function apiRequest<T>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string, 
  data?: any, 
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const axiosInstance = createAxiosInstance();

  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.request({
      method,
      url,
      data,
      ...config
    });

    return response.data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}