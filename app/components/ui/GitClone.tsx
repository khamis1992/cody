import { useState } from 'react';
import { Button } from './Button';
import { Dialog, DialogTitle, DialogDescription, DialogButton, DialogRoot } from './Dialog';
import { toast } from 'react-toastify';
import { useGit } from '~/lib/hooks/useGit';

export function GitClone() {
  const [isOpen, setIsOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const { gitClone } = useGit();

  const handleClone = async () => {
    if (!repoUrl) {
      toast.error('Please enter a repository URL');
      return;
    }
    try {
      await gitClone(repoUrl);
      toast.success('Repository cloned successfully!');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to clone repository.');
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        <div className="i-ph:github-logo-bold" />
        Clone from GitHub
      </Button>
      <DialogRoot open={isOpen}>
        <Dialog onBackdrop={() => setIsOpen(false)} onClose={() => setIsOpen(false)}>
          <div className="p-6 bg-bolt-elements-bg-depth-1">
            <DialogTitle className="text-bolt-elements-textPrimary">Clone a Git Repository</DialogTitle>
            <DialogDescription className="mt-2 text-bolt-elements-textSecondary">
              Enter the URL of the repository you want to clone.
            </DialogDescription>
            <div className="mt-4">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/example/repo.git"
                className="w-full bg-bolt-elements-bg-depth-2 p-2 rounded-lg text-bolt-elements-textPrimary border border-bolt-elements-borderColor"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 bg-bolt-elements-bg-depth-2 border-t border-bolt-elements-borderColor">
            <DialogButton type="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </DialogButton>
            <DialogButton type="primary" onClick={handleClone}>
              Clone
            </DialogButton>
          </div>
        </Dialog>
      </DialogRoot>
    </>
  );
}
