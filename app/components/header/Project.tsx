import { Link } from '@remix-run/react';
import { useAuth } from '~/lib/hooks/useAuth';
import { classNames } from '~/utils/classNames';

export function Project() {
  const { isAuthenticated } = useAuth();

  return (
    <Link
      to={isAuthenticated ? "/project" : '#'}
      className={classNames(
        "transition-colors text-sm font-medium",
        {
          "text-slate-300 hover:text-white": isAuthenticated,
          "text-slate-500 cursor-not-allowed": !isAuthenticated,
        }
      )}
      onClick={(e) => !isAuthenticated && e.preventDefault()}
      aria-disabled={!isAuthenticated}
    >
      Project
    </Link>
  );
}
