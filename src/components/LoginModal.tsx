import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, X } from 'lucide-react';
import { Button } from './ui/Button';
import { useNavigate, Link } from 'react-router-dom';
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
    .matches(/^[a-zA-Z0-9_@.]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres et des underscores'),
  password: Yup.string().required('Mot de passe requis'),
});

export function LoginModal({
  onClose,
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
        toast.success(`Bienvenue, ${result.user.username}!`);
        // Attendre un court instant pour que le token soit bien enregistré
        await new Promise(resolve => setTimeout(resolve, 100));
        onLoginSuccess();
        if (onNavigate) {
          onNavigate('dashboard');
        }
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
        <div className="p-8 relative">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom d'utilisateur"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={onClose}
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
