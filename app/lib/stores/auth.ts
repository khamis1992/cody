import { atom } from 'nanostores';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase/client';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
};

export const authStore = atom<AuthState>(initialState);

// Auth actions
export const authActions = {
  setLoading: (loading: boolean) => {
    authStore.set({ ...authStore.get(), loading });
  },

  setError: (error: string | null) => {
    authStore.set({ ...authStore.get(), error });
  },

  setAuth: (user: User | null, session: Session | null) => {
    authStore.set({
      ...authStore.get(),
      user,
      session,
      loading: false,
      error: null,
    });
  },

  signIn: async (email: string, password: string) => {
    authActions.setLoading(true);
    authActions.setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      authActions.setAuth(data.user, data.session);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      authActions.setError(message);
      authActions.setLoading(false);
      return { success: false, error: message };
    }
  },

  signUp: async (email: string, password: string) => {
    authActions.setLoading(true);
    authActions.setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      authActions.setAuth(data.user, data.session);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      authActions.setError(message);
      authActions.setLoading(false);
      return { success: false, error: message };
    }
  },

  signOut: async () => {
    authActions.setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      authActions.setAuth(null, null);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign out failed';
      authActions.setError(message);
      authActions.setLoading(false);
      return { success: false, error: message };
    }
  },

  signInWithProvider: async (provider: 'google' | 'github' | 'discord') => {
    authActions.setLoading(true);
    authActions.setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'OAuth sign in failed';
      authActions.setError(message);
      authActions.setLoading(false);
      return { success: false, error: message };
    }
  },
};

// Initialize auth state
export const initializeAuth = () => {
  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    authActions.setAuth(session?.user ?? null, session);
  });

  // Listen for auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    authActions.setAuth(session?.user ?? null, session);
  });
};