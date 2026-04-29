import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type Role = 'admin' | 'dev' | 'presidente' | 'user' | null;

interface AuthContextValue {
  session: Session | null;
  role: Role;
  subsectionId: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [subsectionId, setSubsectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role, subsection_id')
      .eq('user_id', userId)
      .eq('active', true)
      .maybeSingle();

    if (error) {
      console.error('AuthContext: error fetching role', error);
      setRole(null);
      setSubsectionId(null);
    } else if (data) {
      setRole(data.role as Role);
      setSubsectionId(data.subsection_id ?? null);
    } else {
      setRole(null);
      setSubsectionId(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // onAuthStateChange fires INITIAL_SESSION on subscribe, so we use it as
    // the single source of truth — no need for a separate getSession() call.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);

      if (newSession?.user) {
        await fetchRole(newSession.user.id);
      } else {
        setRole(null);
        setSubsectionId(null);
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
    await supabase.auth.signOut();
    setRole(null);
    setSubsectionId(null);
  };

  return (
    <AuthContext.Provider value={{ session, role, subsectionId, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
