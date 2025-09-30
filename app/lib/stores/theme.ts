import { atom } from 'nanostores';
import { logStore } from './logs';

export type Theme = 'dark' | 'light';

export const kTheme = 'codelaunch_theme';

export function themeIsDark() {
  return themeStore.get() === 'dark';
}

export const DEFAULT_THEME = 'dark';

// Always initialize with DEFAULT_THEME to avoid hydration mismatch
export const themeStore = atom<Theme>(DEFAULT_THEME);

function initStore() {
  if (!import.meta.env.SSR) {
    const persistedTheme = localStorage.getItem(kTheme) as Theme | undefined;
    const themeAttribute = document.querySelector('html')?.getAttribute('data-theme');

    return persistedTheme ?? (themeAttribute as Theme) ?? DEFAULT_THEME;
  }

  return DEFAULT_THEME;
}

// Initialize theme from localStorage after mount to avoid hydration issues
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const theme = initStore();
      if (theme !== DEFAULT_THEME) {
        themeStore.set(theme);
      }
    });
  } else {
    // DOM is already ready
    const theme = initStore();
    if (theme !== DEFAULT_THEME) {
      themeStore.set(theme);
    }
  }
}

export function toggleTheme() {
  const currentTheme = themeStore.get();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // Update the theme store
  themeStore.set(newTheme);

  // Update localStorage
  localStorage.setItem(kTheme, newTheme);

  // Update the HTML attribute
  document.querySelector('html')?.setAttribute('data-theme', newTheme);

  // Update user profile if it exists
  try {
    const userProfile = localStorage.getItem('codelaunch_user_profile');

    if (userProfile) {
      const profile = JSON.parse(userProfile);
      profile.theme = newTheme;
      localStorage.setItem('codelaunch_user_profile', JSON.stringify(profile));
    }
  } catch (error) {
    console.error('Error updating user profile theme:', error);
  }

  logStore.logSystem(`Theme changed to ${newTheme} mode`);
}
