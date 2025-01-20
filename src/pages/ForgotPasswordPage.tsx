import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await forgotPassword(email);
      toast.success(t('forgot.success', 'Un email de réinitialisation a été envoyé à votre adresse'));
    } catch (error) {
      toast.error(t('forgot.error', 'Une erreur est survenue lors de l\'envoi de l\'email'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/password2.webp), url(/hero-pattern.svg)',
        backgroundSize: 'cover, cover',
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: 'center, center',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Overlay avec flou et dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 to-purple-900/60 backdrop-blur-[4px]"></div>

      {/* Deuxième overlay pour un flou supplémentaire sur l'image de fond */}
      <div className="absolute inset-0 backdrop-blur-sm backdrop-brightness-90 mix-blend-overlay"></div>

      {/* Points d'interrogation décoratifs avec opacité réduite */}
      {/* Première rangée */}
      <div className="absolute -top-20 -left-20 text-[280px] font-bold text-purple-500/10 select-none rotate-12">?</div>
      <div className="absolute top-10 left-1/3 text-[220px] font-bold text-indigo-400/10 select-none -rotate-45">?</div>
      <div className="absolute -top-10 right-10 text-[300px] font-bold text-blue-500/10 select-none rotate-90">?</div>
      
      {/* Deuxième rangée */}
      <div className="absolute top-1/4 -left-10 text-[260px] font-bold text-purple-400/10 select-none -rotate-12">?</div>
      <div className="absolute top-1/4 right-1/3 text-[200px] font-bold text-indigo-500/15 select-none rotate-45">?</div>
      <div className="absolute top-1/3 right-0 text-[240px] font-bold text-blue-400/15 select-none -rotate-90">?</div>

      {/* Rangée centrale */}
      <div className="absolute top-1/2 left-1/4 text-[320px] font-bold text-purple-300/10 select-none rotate-180">?</div>
      <div className="absolute top-1/2 right-1/4 text-[280px] font-bold text-indigo-300/10 select-none rotate-12">?</div>

      {/* Avant-dernière rangée */}
      <div className="absolute bottom-1/3 -left-20 text-[240px] font-bold text-purple-400/15 select-none -rotate-45">?</div>
      <div className="absolute bottom-1/3 left-1/2 text-[200px] font-bold text-indigo-400/15 select-none rotate-90">?</div>
      <div className="absolute bottom-1/3 right-10 text-[260px] font-bold text-blue-300/10 select-none -rotate-12">?</div>

      {/* Dernière rangée */}
      <div className="absolute -bottom-20 left-10 text-[300px] font-bold text-purple-500/10 select-none rotate-45">?</div>
      <div className="absolute bottom-20 left-1/3 text-[220px] font-bold text-indigo-500/15 select-none -rotate-90">?</div>
      <div className="absolute -bottom-10 right-1/4 text-[280px] font-bold text-blue-400/10 select-none rotate-180">?</div>

      <div className="relative z-10 max-w-md w-full mx-4 sm:mx-auto animate-slide-up">
        <div className="flex items-center justify-center mb-8">
          <Link 
            to="/login" 
            className="flex items-center text-lg font-semibold px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-105 transition-all duration-200 group border border-white/20"
          >
            <FiArrowLeft className="mr-2 w-5 h-5 group-hover:animate-wave" />
            {t('forgot.backToLogin', 'Retour à la connexion')}
          </Link>
        </div>
        
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-8 border border-white/20">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
              <FiLock className="w-10 h-10 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 [-webkit-text-stroke:1px_rgb(255,255,255)]">
                {t('forgot.title', 'Mot de passe oublié')}
              </span>
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600 max-w-sm">
              {t('forgot.description', 'Pas de panique ! Entrez votre adresse email et nous vous enverrons les instructions pour réinitialiser votre mot de passe.')}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                {t('common.email', 'Email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-xl block w-full pl-10 pr-3 py-3.5 border border-gray-300 placeholder-gray-400 text-gray-900 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder={t('common.emailPlaceholder', 'Votre adresse email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('common.sending', 'Envoi en cours...')}
                  </div>
                ) : (
                  t('forgot.sendButton', 'Envoyer les instructions')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
