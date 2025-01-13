import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { signIn, getCurrentSession } from '../lib/auth';

type AuthResult = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
};

export function useAuth(): AuthResult {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function authenticate() {
      try {
        console.log('🔐 Attempting to authenticate...');
        // Check for existing session first
        const session = await getCurrentSession();
        
        console.log('🔑 Current session:', session);
        
        if (session) {
          console.log('✅ Existing session found');
          if (mounted) setIsAuthenticated(true);
        } else {
          console.log('🚨 No existing session');
          if (mounted) {
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('🚫 Authentication error:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Authentication failed'));
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          console.log(`🔓 Authentication state: ${isAuthenticated}`);
        }
      }
    }

    authenticate();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        console.log(`🔄 Auth state changed: ${event}`);
        setIsAuthenticated(!!session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  return { 
    isAuthenticated, 
    isLoading, 
    error, 
    signOut 
  };
}