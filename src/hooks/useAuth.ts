import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { signIn, getCurrentSession } from '../lib/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function authenticate() {
      try {
        // Check for existing session first
        const session = await getCurrentSession();
        
        if (session) {
          if (mounted) setIsAuthenticated(true);
        } else {
          // No session, try to sign in with demo credentials
          await signIn('demo@example.com', 'demo123');
          if (mounted) setIsAuthenticated(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Authentication failed'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    authenticate();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        setIsAuthenticated(!!session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, isLoading, error };
}