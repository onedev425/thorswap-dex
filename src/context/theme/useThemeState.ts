import { useColorMode } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useApp } from "store/app/hooks";
import { ThemeType } from "types/app";

export const useThemeState = () => {
  const getThemeFromQuery = () => {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get("theme");

    switch (theme) {
      case ThemeType.Light:
        return ThemeType.Light;
      case ThemeType.Dark:
        return ThemeType.Dark;
      default:
        return null;
    }
  };

  const [themeFromQuery, setThemeFromQuery] = useState(getThemeFromQuery);
  const defaultTheme = getThemeFromQuery();
  const { themeType, setTheme } = useApp();
  const { setColorMode } = useColorMode();

  const [activeTheme, setActiveTheme] = useState(defaultTheme || themeType);

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
    if (themeFromQuery) {
      activateTheme(themeFromQuery);
      setTheme(themeFromQuery);
      setThemeFromQuery(null);
      return;
    }

    activateTheme(themeType);
  }, [activateTheme, setTheme, themeFromQuery, themeType]);

  return { theme: activeTheme, isLight: activeTheme === ThemeType.Light };
};
