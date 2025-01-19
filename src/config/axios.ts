import axios, { AxiosError } from 'axios';

// Configuration par défaut
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;
// Timeout supprimé

// Intercepteur pour les requêtes
axios.interceptors.request.use(
  (config) => {
    // Configuration des en-têtes de base
    const headers = new axios.AxiosHeaders(config.headers);
    config.headers = headers;
    return config;
  },
  (error) => {
    console.error('Erreur de configuration de la requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      // qui n'est pas dans la plage 2xx
      console.error('Erreur de réponse serveur:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url,
        method: error.config?.method,
      });

      // Gestion des erreurs spécifiques par code de statut
      switch (error.response.status) {
        case 400:
          console.error('Mauvaise requête: Vérifiez les paramètres envoyés');
          break;
        case 401:
          console.error('Non autorisé: Problème d\'authentification');
          break;
        case 403:
          console.error('Interdit: Vous n\'avez pas les permissions nécessaires');
          break;
        case 404:
          console.error('Ressource non trouvée');
          break;
        case 500:
          console.error('Erreur interne du serveur');
          break;
        default:
          console.error('Une erreur inattendue est survenue');
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Aucune réponse reçue:', {
        request: error.request,
        url: error.config?.url,
        method: error.config?.method,
      });
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axios;
