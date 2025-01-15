import axios from 'axios';

// Configuration globale d'Axios
export const configureAxios = () => {
  const getToken = () => localStorage.getItem('token');

  axios.interceptors.request.use((config) => {
    config.headers['Authorization'] = getToken() ? `Bearer ${getToken()}` : undefined;
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token invalide ou expiré
        localStorage.removeItem('token');
        // Rediriger vers la page de connexion
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );
};
