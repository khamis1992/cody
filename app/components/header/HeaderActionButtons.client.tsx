import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { DeployButton } from '~/components/deploy/DeployButton';
import { profileStore } from '~/lib/stores/profile';
import { Button } from '../ui/Button';
import { History } from '../ui/History';
import { GitClone } from '../ui/GitClone';
import Popover from '../ui/Popover';
import { SettingsButton } from '../ui/SettingsButton';
import { HelpButton } from './HelpButton';
import { ControlPanel } from '../@settings/core/ControlPanel';

interface HeaderActionButtonsProps {
  chatStarted: boolean;
}

export const HeaderActionButtons = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(-1);
  const [activePreviewIndex] = useState(0);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[activePreviewIndex];

  const shouldShowButtons = activePreview;

  const profile = useStore(profileStore.profile);

  const handleSettingsClick = () => {
    setIsSettingsOpen(0);
  };

  return (
    <div className="flex items-center gap-3">
      <a href="/">
        <Button>
          <div className="i-ph:plus-bold" />
          New Chat
        </Button>
      </a>
      <History />
      <GitClone />
      <DeployButton />
      <Popover
        side="bottom"
        align="end"
        trigger={
          <button className="flex items-center justify-center w-8 h-8 overflow-hidden bg-bg-depth-2 text-text-secondary rounded-full shrink-0">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="i-ph:user" />
            )}
          </button>
        }
      >
        <div className="flex flex-col gap-1.5 p-2 min-w-[200px]">
          <SettingsButton onClick={handleSettingsClick} />
          <HelpButton onClick={() => window.open('https://stackblitz-labs.github.io/bolt.diy/', '_blank')} />
        </div>
      </Popover>

      <ControlPanel
        open={isSettingsOpen !== -1}
        onClose={() => setIsSettingsOpen(-1)}
      />
    </div>
  );
};
