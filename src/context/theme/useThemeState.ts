import { useColorMode } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useApp } from 'store/app/hooks';
import { ThemeType } from 'types/app';

export const useThemeState = () => {
  const { themeType } = useApp();
  const { setColorMode } = useColorMode();

  const [activeTheme, setActiveTheme] = useState(ThemeType.Dark);

  const activateTheme = useCallback(
    (updatedTheme: ThemeType) => {
      setColorMode(updatedTheme);

      if (updatedTheme === ThemeType.Light) {
        document.documentElement.classList.remove(ThemeType.Dark);
      } else if (!document.documentElement.classList.contains(ThemeType.Dark)) {
        document.documentElement.classList.add(ThemeType.Dark);
      }

      document.documentElement.dataset.theme = updatedTheme;
      setActiveTheme(updatedTheme);
    },
    [setColorMode],
  );

  useEffect(() => {
    activateTheme(themeType);
  }, [activateTheme, themeType]);

  return { theme: activeTheme, isLight: activeTheme === ThemeType.Light };
};
