import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  onNavigate?: (page: "dashboard" | "settings" | "devices" | "device-details" | "analytics" | "users" | "reports" | "applications") => void;
}

export function LoginModal({ 
  onLoginSuccess, 
  onNavigate,
}: LoginModalProps) {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);  // Définir le chargement avant la tentative de connexion
    
    try {
      console.log('🔍 Tentative de connexion avec:', username);
      
      // Ajout d'un debugger pour forcer l'arrêt
      
      const result = await signIn(username, password);
      
      // Log détaillé du résultat
      console.log('🎉 Résultat de connexion complet:', result);
      console.log('🔑 Token:', result?.access_token);
      console.log('👤 Utilisateur:', result?.user);
      
      // Validation explicite du résultat de connexion
      if (!result || !result.access_token || !result.user) {
        // Si le résultat est incomplet, traiter comme une erreur de connexion
        throw new Error('Connexion invalide : informations manquantes');
      }
      
      const { access_token, user } = result;

      
      // Validation supplémentaire du token et de l'utilisateur
      if (!access_token) {
        throw new Error('Token d\'accès manquant');
      }
      
      if (!user || !user.role) {
        throw new Error('Informations utilisateur incomplètes');
      }
      
      // Réinitialiser le chargement en cas de succès
      setIsLoading(false);
      onLoginSuccess();
      
      // Navigation basée sur le rôle
      if (user.role === 'admin') {
        onNavigate ? onNavigate('dashboard') : navigate('/admin-dashboard');
      } else {
        onNavigate ? onNavigate('dashboard') : navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Détails complets de l\'erreur:', err);
      
      // Gestion détaillée des messages d'erreur
      const errorMessage = 
        err.message === 'Connexion invalide : informations manquantes' 
        ? 'Échec de l\'authentification' 
        : (err.message || 'Identifiants incorrects');
      
      setError(errorMessage);
      
      // Réinitialiser le chargement en cas d'erreur
      setIsLoading(false);
      
      // Log supplémentaire pour le débogage
      console.warn('Erreur de connexion:', errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
            <p className="text-gray-600 mt-2">Accédez à votre tableau de bord</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Erreur : </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre nom d'utilisateur"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  className="text-gray-700 w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button 
              onClick={handleLogin} 
              className="w-full"
              variant="gradient"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
              Mot de passe oublié ?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
