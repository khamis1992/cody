import { useStore } from '@nanostores/react';
import { useEffect } from 'react';
import { authStore, authActions, initializeAuth } from '~/lib/stores/auth';

export function useAuth() {
  const auth = useStore(authStore);

  useEffect(() => {
    initializeAuth();
  }, []);

  return {
    user: auth.user,
    session: auth.session,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: !!auth.user,
    signIn: authActions.signIn,
    signUp: authActions.signUp,
    signOut: authActions.signOut,
    signInWithProvider: authActions.signInWithProvider,
    clearError: () => authActions.setError(null),
  };
}