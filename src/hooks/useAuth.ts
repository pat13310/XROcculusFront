import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

interface JwtPayload {
  exp?: number;  // Timestamp d'expiration
  sub?: string;  // Identifiant du sujet (généralement l'ID utilisateur)
  username?: string;
  // Ajoutez d'autres champs selon votre token JWT spécifique
}

type AuthResult = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  signOut: () => void;
  signIn: (username: string, password: string) => Promise<void>;
};

export function useAuth(): AuthResult {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');
  const setToken = (token: string) => localStorage.setItem('token', token);
  const removeToken = () => localStorage.removeItem('token');

  const checkTokenValidity = () => {
    const token = getToken();
    
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          removeToken();
          setIsAuthenticated(false);
          navigate('/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        removeToken();
        setIsAuthenticated(false);
        navigate('/login');
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkTokenValidity();
  }, [navigate]);

  const signIn = async (username: string, password: string) => {
    try {
      // Validation basique des entrées
      if (!username || !password) {
        throw new Error('Nom d\'utilisateur et mot de passe requis');
      }

      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${baseUrl}/login`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Ajouter un timeout pour gérer les connexions lentes
        timeout: 10000
      });

      // Vérification supplémentaire de la réponse
      if (!response.data || !response.data.access_token) {
        throw new Error('Jeton d\'accès invalide');
      }

      const { access_token } = response.data;
      
      // Validation du token
      const decodedToken = jwtDecode<JwtPayload>(access_token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        throw new Error('Jeton expiré');
      }

      // Stocker le token et mettre à jour l'état
      setToken(access_token);
      setIsAuthenticated(true);
      
      // Réinitialiser l'erreur en cas de connexion réussie
      setError(null);

      return response.data;
    } catch (error: any) {
      // Gestion détaillée des erreurs
      let errorMessage = 'Échec de connexion';

      if (axios.isAxiosError(error)) {
        // Erreurs spécifiques à Axios
        if (error.response) {
          // Le serveur a répondu avec un statut d'erreur
          switch (error.response.status) {
            case 401:
              errorMessage = 'Identifiants incorrects';
              break;
            case 403:
              errorMessage = 'Accès refusé';
              break;
            case 500:
              errorMessage = 'Erreur serveur';
              break;
            default:
              errorMessage = error.response.data?.detail || 'Erreur de connexion';
          }
        } else if (error.request) {
          // La requête a été faite mais pas de réponse
          errorMessage = 'Pas de réponse du serveur';
        }
      } else if (error.message) {
        // Autres types d'erreurs
        errorMessage = error.message;
      }

      console.error('Détails de l\'erreur de connexion:', error);
      setError(new Error(errorMessage));
      setIsAuthenticated(false);

      // Relancer l'erreur pour que le composant appelant puisse la gérer
      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    try {
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Toujours nettoyer les données côté client
      removeToken();
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  return { 
    isAuthenticated, 
    isLoading, 
    error, 
    signOut,
    signIn
  };
}