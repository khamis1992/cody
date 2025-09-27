import { useState } from 'react';
import { useAuth } from '~/lib/hooks/useAuth';
import { LoginModal } from './LoginModal';
import { UserMenu } from './UserMenu';
import { Button } from '~/components/ui/Button';

export function AuthButton() {
  const { isAuthenticated, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
    );
  }

  if (isAuthenticated) {
    return <UserMenu />;
  }

  return (
    <>
      <Button
        onClick={() => setShowLoginModal(true)}
        className="px-4 py-2 text-accent-400 border border-accent-500/30 rounded-lg hover:bg-accent-500/10 transition-colors"
      >
        Sign In
      </Button>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}