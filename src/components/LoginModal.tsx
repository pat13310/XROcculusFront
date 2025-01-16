import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast'; // Importation de la bibliothèque de notifications toast
import * as Yup from 'yup';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  onNavigate?: (page: "dashboard" | "settings" | "devices" | "device-details" | "analytics" | "users" | "reports" | "applications") => void;
}

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Nom d\'utilisateur requis')
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .matches(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres et des underscores'),
  password: Yup.string().required('Mot de passe requis'),
});

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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validation du nom d'utilisateur en premier
      if (!username) {
        setError('Nom d\'utilisateur requis');
        toast.error('Nom d\'utilisateur requis');
        return;
      }

      // Validation du mot de passe ensuite
      if (!password) {
        setError('Mot de passe requis');
        toast.error('Mot de passe requis');
        return;
      }

      // Validation complète avec Yup
      await loginSchema.validate({ username, password });

      const result = await signIn(username, password);

      if (result.success) {
        let path = "/dashboard";
        if (result.user.role === 'admin') {
          path = '/dashboard';
        }

        toast.success(`Bienvenue, ${result.user.username}!`);
        onLoginSuccess();
        navigate(path);
      } else {
        setError(result.error || 'Erreur de connexion');
        toast.error(result.error || 'La connexion a échoué');
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('Erreur de connexion');
        toast.error('Erreur de connexion');
      }
    } finally {
      setIsLoading(false);
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

          <form onSubmit={handleSubmit}>
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
                    className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                type="submit"
                className="w-full"
                variant="gradient"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
              <Toaster position="top-right" />
            </div>

            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                Mot de passe oublié ?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
