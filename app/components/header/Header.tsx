import { useStore } from '@nanostores/react';
import { Link } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { AuthButton } from '~/components/auth/AuthButton';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { Logo } from '../ui/logo';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { Project } from './Project';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames(
        'flex items-center px-4 sm:px-6 border-b h-[var(--header-height)] backdrop-blur-sm',
        {
          'border-transparent bg-slate-950/80 shadow-none': !chat.started,
          'border-slate-200/30 dark:border-slate-700/30 bg-white/80 dark:bg-slate-950/80 shadow-lg':
            chat.started,
        },
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <Logo />
        </Link>
      </div>
      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="flex items-center gap-2">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}

      <div className="ml-auto flex items-center space-x-8">
        <nav className="flex items-center space-x-8">
          <Link
            to="/resources"
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Resources
          </Link>
          <ClientOnly fallback={null}>
            {() => <Project />}
          </ClientOnly>
          <Link
            to="/pricing"
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Pricing
          </Link>
        </nav>
        <ClientOnly fallback={<div style={{ width: '88px' }} />}>
          {() => <AuthButton />}
        </ClientOnly>
      </div>
    </header>
  );
}
