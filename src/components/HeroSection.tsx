import { ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { VRDeviceIllustration } from './VRDeviceIllustration';
import { useTranslation } from '../contexts/TranslationContext';

interface HeroSectionProps {
  handleOpenLoginModal: () => void;
}

export function HeroSection({ handleOpenLoginModal }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden min-h-[10vh] flex items-center justify-center bg-gray-900">
      {/* Image de fond optimisée */}
      <div 
        className="absolute inset-0 bg-cover z-0"
        style={{ 
          backgroundImage: 'url(/images/hero.webp)',
          backgroundSize: '100%',
          backgroundPosition: 'center 35%',
          opacity: 0.85,
          filter: 'brightness(30%) contrast(110%) grayscale(50%)',
        }}
      />
      
      {/* Overlay avec dégradé subtil */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-gray-900/90" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center gap-2 py-2 pb-4">
          {/* Contenu principal */}
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="mt-0z-10">
              {/* Badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-[10px]">
                  <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="ml-1.5 font-medium text-white/80">Plateforme Active</span>
                  <span className="mx-1.5 text-white/20">|</span>
                  <span className="text-white/60">v2.0</span>
                </div>
              </div>

              {/* Titre */}
              <h1 className="text-center text-2xl lg:text-6xl font-bold tracking-tight mt-8 p-4">
                <span className="p-4 inline-block bg-gradient-to-br from-indigo-200 via-pink-400 to-purple-100 bg-clip-text text-transparent [text-shadow:_-1px_-1px_1px_rgba(168,85,247,0.2),_1px_-1px_1px_rgba(168,85,247,0.2),_-1px_1px_1px_rgba(168,85,247,0.2),_1px_1px_1px_rgba(168,85,247,0.2)]">
                  Gérez Vos Casques XR
                </span>
              </h1>
              <p className="text-center text-sm lg:text-base text-gray-200/90 mt-2 mb-4">
                La plateforme intelligente pour gérer votre flotte de casques VR/AR en toute simplicité
              </p>

              {/* Illustration avec overlay */}
              <div className="relative mt-8">
                <div className="absolute -inset-1 bg-gradient-to-tr from-purple-500/10 via-purple-500/5 to-transparent rounded-3xl blur-xl p-4" />
                <div className="relative max-h-[180px] overflow-hidden">
                  <VRDeviceIllustration className="w-full h-auto drop-shadow-[0_0_25px_rgba(168,85,247,0.2)] scale-125 translate-y-4" />
                </div>
                
                {/* Actions et Stats superposés */}
                <div className="absolute -bottom-1 left-0 right-0 flex flex-col items-center gap-2 px-4 sm:px-8">
                  {/* Actions */}
                  <div className="flex gap-12 justify-center">
                    <Button 
                      onClick={handleOpenLoginModal}
                      variant="gradient"
                      className="h-10 px-3 bg-purple-500 hover:bg-purple-600 text-xs font-medium transition-all duration-200"
                    >
                      Commencer
                      <ChevronRight className="ml-1.5 w-3 h-3" />
                    </Button>

                    <a 
                      href="#features" 
                      className="h-10 px-3 inline-flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-xs font-medium text-white/90 transition-colors duration-200"
                    >
                      En Savoir Plus
                      <ArrowRight className="ml-1.5 w-3 h-3 opacity-70" />
                    </a>
                  </div>

                
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
