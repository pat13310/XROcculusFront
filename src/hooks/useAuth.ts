import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import * as Yup from 'yup';

// Schéma de validation pour le username et le mot de passe
const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Le nom d\'utilisateur est obligatoire')
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(50, 'Le nom d\'utilisateur est trop long')
    .matches(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres et des underscores'),
  password: Yup.string()
    .required('Le mot de passe est obligatoire')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    // .matches(/[A-Z]/, 'Le mot de passe doit contenir une majuscule')
    .matches(/[a-z]/, 'Le mot de passe doit contenir une minuscule')
    // .matches(/[0-9]/, 'Le mot de passe doit contenir un chiffre')
    // .matches(/[!@#$%^&*()]/, 'Le mot de passe doit contenir un caractère spécial')
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
      // Validation initiale des entrées
      if (!username || !password) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        return { 
          success: false, 
          error: 'Nom d\'utilisateur ou mot de passe manquant' 
        };
      }

      setState({ ...state, isLoading: true });

      const response = await axios.post(`${baseUrl}/auth/login`, 
        `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const { access_token: token, user } = response.data;
      
      // Validation du token et de l'utilisateur
      if (!token || !user) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        return { 
          success: false, 
          error: 'Authentification échouée' 
        };
      }

      // Log de sécurité pour la tentative de connexion
      console.log(`Connexion réussie pour l'utilisateur: ${username} à ${new Date().toISOString()}`);

      // Stocker le token
      setToken(token);

      // Mettre à jour l'état avec les informations de l'utilisateur
      setState({
        user: user,
        isAuthenticated: true,
        isLoading: false
      });

      return { 
        success: true, 
        user: user, 
        token: token,
        role: user.role // Ajouter le rôle pour une navigation conditionnelle
      };
    } catch (error: any) {
      // Gestion des erreurs détaillée
      console.error('Erreur de connexion:', error);
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });

      return { 
        success: false, 
        error: error.response?.data?.message || 'Impossible de se connecter'
      };
    }
  };

  const signOut = useCallback(() => {
    removeToken();
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
      const fetchProfile = async () => {
        try {
          const { data } = await axios.get(`${baseUrl}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setState({
            user: data,
            isAuthenticated: true,
            isLoading: false
          });
        } catch {
          removeToken();
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      };

      fetchProfile();
    } else {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false
      }));
    }
  }, [baseUrl, isTokenValid, getToken()]);

  return {
    ...state,
    signIn,
    signOut
  };
}