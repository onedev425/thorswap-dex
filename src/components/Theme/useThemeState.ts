import { useColorMode } from '@chakra-ui/react';
import { ThemeMode } from 'components/Theme/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from 'store/app/hooks';
import { ThemeType } from 'types/app';

export const useThemeState = () => {
  const { themeType } = useApp();
  const mounted = useRef(false);
  const { setColorMode } = useColorMode();

  const getThemeMode = (type: ThemeType) => {
    const isDark =
      type === ThemeType.Dark ||
      (type === ThemeType.Auto && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return isDark ? ThemeMode.Dark : ThemeMode.Light;
  };
  const [activeTheme, setActiveTheme] = useState<ThemeMode | null>(null);
  const isLight = activeTheme === ThemeMode.Light;

  const activateTheme = useCallback(
    (updatedTheme: ThemeMode) => {
      setColorMode(updatedTheme);

      if (updatedTheme === ThemeMode.Light) {
        document.documentElement.classList.remove(ThemeMode.Dark);
      } else if (!document.documentElement.classList.contains(ThemeMode.Dark)) {
        document.documentElement.classList.add(ThemeMode.Dark);
      }

      document.documentElement.dataset.theme = updatedTheme;
      setActiveTheme(updatedTheme);
    },
    [setColorMode],
  );

  if (!mounted.current) {
    activateTheme(getThemeMode(themeType));
    mounted.current = true;
  }

  useEffect(() => {
    activateTheme(getThemeMode(themeType));
  }, [activateTheme, themeType]);

  return { theme: activeTheme, isLight };
};
