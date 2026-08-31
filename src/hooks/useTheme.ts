import { useEffect } from 'react';
import { useAppStore } from '../state/appState';

export function useTheme() {
  const { theme, setTheme } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;

    if (theme.mode === 'system') {
      root.setAttribute('data-theme', 'system');

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        root.setAttribute('data-theme', e.matches ? 'system' : 'system');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      root.setAttribute('data-theme', theme.mode);
    }
  }, [theme.mode]);

  const cycleTheme = () => {
    const modes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(theme.mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTheme({ mode: modes[nextIndex] });
  };

  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    setTheme({ mode });
  };

  return {
    theme: theme.mode,
    cycleTheme,
    setThemeMode,
  };
}
