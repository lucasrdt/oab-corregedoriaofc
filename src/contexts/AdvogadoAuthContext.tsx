import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface AdvogadoProfile {
  id: string;
  oab: string;
  nome: string;
  email: string;
}

interface AdvogadoAuthContextValue {
  session: Session | null;
  advogado: AdvogadoProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AdvogadoAuthContext = createContext<AdvogadoAuthContextValue | null>(null);

export const AdvogadoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [advogado, setAdvogado] = useState<AdvogadoProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('advogados')
      .select('id, oab, nome, email')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('AdvogadoAuthContext: error fetching profile', error);
      setAdvogado(null);
    } else if (data) {
      setAdvogado(data as AdvogadoProfile);
    } else {
      setAdvogado(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);

      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else {
        setAdvogado(null);
      }

      if (mounted) {
        setLoading(false);
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
    } catch (err) {
      console.warn('AdvogadoAuthContext: error during sign out', err);
    } finally {
      setSession(null);
      setAdvogado(null);
    }
  };

  return (
    <AdvogadoAuthContext.Provider value={{ session, advogado, loading, signOut }}>
      {children}
    </AdvogadoAuthContext.Provider>
  );
};

export const useAdvogadoAuth = (): AdvogadoAuthContextValue => {
  const ctx = useContext(AdvogadoAuthContext);
  if (!ctx) {
    throw new Error('useAdvogadoAuth must be used within an AdvogadoAuthProvider');
  }
  return ctx;
};
