import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import jwtDecode from 'jwt-decode';
import * as Yup from 'yup';

// Schéma de validation pour l'email et le mot de passe
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required('L\'email est obligatoire')
    .email('L\'email doit être valide')
    .max(50, 'L\'email est trop long'),
  password: Yup.string()
    .required('Le mot de passe est obligatoire')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[a-z]/, 'Le mot de passe doit contenir une minuscule')
});

interface AuthState {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  const getToken = () => localStorage.getItem('token');
  const setToken = (token: string) => localStorage.setItem('token', token);
  const removeToken = () => localStorage.removeItem('token');

  const isTokenValid = useCallback((token: string) => {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      console.log('Tentative de connexion avec:', username);

      const response = await axios.post(`${baseUrl}/auth/login`, 
        {
          email: username,
          password: password
        },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true,
        }
      );
      
      console.log('Réponse de connexion complète:', response);
      console.log('Statut de la réponse:', response.status);
      console.log('Données de la réponse:', response.data);
      
      const { access_token: token, user } = response.data;
      
      console.log('Token reçu:', !!token);
      console.log('Informations utilisateur:', user);

      if (!token || !user) {
        console.error('Token ou utilisateur manquant');
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return {
          success: false,
          error: 'Impossible de récupérer les informations utilisateur'
        };
      }

      // Stocker le token
      setToken(token);

      // Stocker les informations utilisateur dans le localStorage
      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('authToken', token);

      // Mettre à jour l'état de l'authentification
      setState({
        user: user,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log('État après connexion:', {
        isAuthenticated: true,
        user: user
      });

      return {
        success: true,
        user: user
      };

    } catch (axiosError: unknown) {
      console.error('Erreur de connexion complète:', axiosError);
      
      // Type guard pour vérifier si c'est une erreur Axios
      if (axios.isAxiosError(axiosError)) {
        console.error('Erreur Axios détaillée:', axiosError);
        
        // Gestion spécifique des erreurs Axios
        if (axiosError.response) {
          console.error('Données de l\'erreur:', axiosError.response.data);
          console.error('Statut de l\'erreur:', axiosError.response.status);
          console.error('En-têtes de l\'erreur:', axiosError.response.headers);
        }
      }

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return {
        success: false,
        error: axiosError instanceof Error ? axiosError.message : 'Erreur de connexion'
      };
    }
  };

  const signOut = useCallback(() => {
    removeToken();
    localStorage.removeItem('userInfo');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const token = getToken();

    if (token && isTokenValid(token)) {
      // Récupérer les informations utilisateur depuis le localStorage
      const userInfoString = localStorage.getItem('userInfo');
      
      if (userInfoString) {
        try {
          const userData = JSON.parse(userInfoString);
          setState({
            user: userData,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          console.error('Erreur lors du parsing des informations utilisateur:', error);
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }

    } else {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }

  }, [navigate]);

  return {
    ...state,
    signIn,
    signOut,
    getToken,
    isTokenValid
  };
}