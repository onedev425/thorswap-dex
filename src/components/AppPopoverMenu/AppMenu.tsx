import { Box, Card, Icon, Typography } from 'components/Atomic';
import { Scrollbar } from 'components/Scrollbar';
import { BUILD_NUMBER } from 'config/constants';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import packageJson from '../../../package.json';

import { MainMenu } from './components/MainMenu';
import { SocialIcons } from './components/SocialIcons';
import { Submenu } from './components/Submenu';
import { SwitchMenu } from './components/SwitchMenu';
import { useAppPopoverMenu } from './useAppPopoverMenu';

export const AppMenu = () => {
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const { menus, menuType, onBack } = useAppPopoverMenu();

  useLayoutEffect(() => {
    if (mainMenuRef.current?.clientWidth) {
      setContainerWidth(mainMenuRef.current?.clientWidth);
    }
  }, []);

  const menuElement = useMemo(() => {
    switch (menuType) {
      case 'main':
        return (
          <Box col className="gap-4" ref={mainMenuRef}>
            <MainMenu items={menus.main.items} />
            <SocialIcons />
          </Box>
        );
      case 'settings':
        return (
          <Box style={{ width: containerWidth }}>
            <SwitchMenu items={menus.settings.items} />
          </Box>
        );
      case 'language':
        return (
          <Box style={{ width: containerWidth }}>
            <Scrollbar height="420px">
              <Submenu items={menus[menuType].items} />
            </Scrollbar>
          </Box>
        );
      case 'proMode':
        return (
          <Box style={{ width: containerWidth }}>
            <SwitchMenu items={menus.proMode.items} />
          </Box>
        );
      default:
        return (
          <Box style={{ width: containerWidth }}>
            <Submenu items={menus[menuType].items} />
          </Box>
        );
    }
  }, [containerWidth, menuType, menus]);

  return (
    <div>
      <Card
        className="flex-col px-4 m-1 mt-2 min-w-[160px] border border-solid border-btn-primary"
        size="sm"
      >
        <Box col className="m-2">
          <Box alignCenter row>
            {menuType !== 'main' && (
              <Box
                center
                className="p-2.5 !mr-2 rounded-2xl hover:bg-btn-light-tint-active dark:hover:bg-btn-dark-tint-active cursor-pointer"
                onClick={onBack}
              >
                <Icon name="chevronLeft" />
              </Box>
            )}
            <Typography variant="subtitle2">{menus[menuType].title}</Typography>
          </Box>
        </Box>

        {menuElement}

        <Box justify="end">
          <Typography color="secondary" variant="caption-xs">
            {`v${packageJson.version} (${BUILD_NUMBER})`}
          </Typography>
        </Box>
      </Card>
    </div>
  );
};
