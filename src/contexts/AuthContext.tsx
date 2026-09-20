import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  hasActiveSubscription: boolean;
  isAdmin: boolean;
  giftGrantedAt: string | null;
  isAccessLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [giftGrantedAt, setGiftGrantedAt] = useState<string | null>(null);
  const [isAccessLoading, setIsAccessLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Access checks (subscription status + admin flag) run separately from the
  // session bootstrap above — neither should block the other from resolving.
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setHasActiveSubscription(false);
      setIsAdmin(false);
      setGiftGrantedAt(null);
      setIsAccessLoading(false);
      return;
    }

    let cancelled = false;
    setIsAccessLoading(true);

    (async () => {
      const [subResult, profileResult] = await Promise.allSettled([
        supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', userId)
          .eq('status', 'active')
          .limit(1)
          .maybeSingle(),
        // `select('*')` on purpose: naming gift_granted_at explicitly makes the
        // whole query 400 until that migration is applied, which would also
        // wipe out is_admin.
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      ]);

      if (cancelled) return;

      setHasActiveSubscription(subResult.status === 'fulfilled' && !!subResult.value.data);
      const profile =
        profileResult.status === 'fulfilled'
          ? (profileResult.value.data as { is_admin?: boolean; gift_granted_at?: string } | null)
          : null;

      setIsAdmin(!!profile?.is_admin);
      setGiftGrantedAt(profile?.gift_granted_at ?? null);
      setIsAccessLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    // With email confirmation disabled, signUp already returns an active session
    // (onAuthStateChange picks it up automatically). Otherwise the user must confirm first.
    return { error: error?.message ?? null, needsEmailConfirmation: !error && !data.session };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error?.message ?? null };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        hasActiveSubscription,
        isAdmin,
        giftGrantedAt,
        isAccessLoading,
        signIn,
        signUp,
        signOut,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }
  return ctx;
}
