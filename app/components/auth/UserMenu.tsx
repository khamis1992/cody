import { useState } from 'react';
import { useAuth } from '~/lib/hooks/useAuth';
import { toast } from 'react-toastify';
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from '~/components/ui/Dropdown';
import { LogOut, User as UserIcon } from 'lucide-react';

export function UserMenu() {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      toast.success('Signed out successfully');
    }
  };

  if (!user) return null;

  const trigger = (
    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium">
        {user.email?.charAt(0).toUpperCase()}
      </div>
      <div className="hidden md:block">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {user.user_metadata?.full_name || user.email?.split('@')[0]}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {user.email}
        </div>
      </div>
    </div>
  );

  return (
    <Dropdown trigger={trigger}>
      <div className="px-3 py-2">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {user.user_metadata?.full_name || user.email?.split('@')[0]}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {user.email}
        </p>
      </div>
      <DropdownSeparator />
      <DropdownItem onSelect={() => { /* Navigate to profile */ }}>
        <UserIcon className="w-4 h-4" />
        <span>Profile Settings</span>
      </DropdownItem>
      <DropdownItem onSelect={handleSignOut} disabled={loading}>
        <LogOut className="w-4 h-4" />
        <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
      </DropdownItem>
    </Dropdown>
  );
}