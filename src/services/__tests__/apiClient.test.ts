import { apiRequest } from '../apiClient';
import axios from 'axios';
import { getConfig } from '../../config/appConfig';

// Mock axios et getConfig
jest.mock('axios');
jest.mock('../../config/appConfig');

describe('apiClient', () => {
  // Interface de test
  interface TestResponse {
    id: number;
    name: string;
  }

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
    
    // Configuration mock par défaut
    (getConfig as jest.Mock).mockReturnValue({
      apiBaseUrl: 'http://test-api.example.com',
      apiTimeout: 5000
    });

    // Configurer le mock axios
    (axios.create as jest.Mock).mockReturnValue({
      request: jest.fn()
    });
  });

  it('devrait effectuer un appel API GET avec succès', async () => {
    // Préparer la réponse mockée
    const mockResponse = {
      data: {
        data: { id: 1, name: 'Test Item' },
        message: 'Succès'
      }
    };

    // Configurer le mock de request
    const axiosInstance = axios.create();
    (axiosInstance.request as jest.Mock).mockResolvedValue(mockResponse);

    // Effectuer l'appel API
    const result = await apiRequest<TestResponse>('get', '/test-endpoint');

    // Vérifications
    expect(result).toEqual(mockResponse.data);
    expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({
      baseURL: 'http://test-api.example.com',
      timeout: 5000
    }));
  });

  it('devrait gérer les erreurs d\'API', async () => {
    // Préparer une erreur mockée
    const mockError = new Error('Erreur de réseau');
    
    // Configurer le mock de request pour lever une erreur
    const axiosInstance = axios.create();
    (axiosInstance.request as jest.Mock).mockRejectedValue(mockError);

    // Vérifier que l'erreur est bien propagée
    await expect(apiRequest<TestResponse>('get', '/test-endpoint'))
      .rejects
      .toThrow('Erreur de réseau');
  });

  it('devrait permettre l\'envoi de données dans un POST', async () => {
    // Préparer la réponse mockée pour un POST
    const mockResponse = {
      data: {
        data: { id: 2, name: 'Nouvel élément' },
        message: 'Création réussie'
      }
    };

    // Données à envoyer
    const postData = { name: 'Nouvel élément' };

    // Configurer le mock de request
    const axiosInstance = axios.create();
    (axiosInstance.request as jest.Mock).mockResolvedValue(mockResponse);

    // Effectuer l'appel API POST
    const result = await apiRequest<TestResponse>('post', '/test-endpoint', postData);

    // Vérifications
    expect(result).toEqual(mockResponse.data);
    
    // Vérifier que la requête a été faite avec les bonnes données
    expect(axiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        url: '/test-endpoint',
        data: postData
      })
    );
  });
});
