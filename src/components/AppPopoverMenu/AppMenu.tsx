import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import { BUILD_NUMBER } from 'config/constants'

import { MainMenu } from 'components/AppPopoverMenu/components/MainMenu'
import { Submenu } from 'components/AppPopoverMenu/components/Submenu'
import { SwitchMenu } from 'components/AppPopoverMenu/components/SwitchMenu'
import { useAppPopoverMenu } from 'components/AppPopoverMenu/useAppPopoverMenu'
import { Box, Card, Icon, Typography } from 'components/Atomic'
import { Scrollbar } from 'components/Scrollbar'
import SocialIcons from 'components/SocialIcons'

import packageJson from '../../../package.json'

export const AppMenu = () => {
  const mainMenuRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  const { menus, menuType, onBack } = useAppPopoverMenu()

  useLayoutEffect(() => {
    if (mainMenuRef.current?.clientWidth) {
      setContainerWidth(mainMenuRef.current?.clientWidth)
    }
  }, [])

  const menuElement = useMemo(() => {
    switch (menuType) {
      case 'main':
        return (
          <Box className="gap-4" col ref={mainMenuRef}>
            <MainMenu items={menus.main.items} />
            <SocialIcons />
          </Box>
        )
      case 'settings':
        return (
          <Box style={{ width: containerWidth }}>
            <SwitchMenu items={menus.settings.items} />
          </Box>
        )
      case 'language':
        return (
          <Box style={{ width: containerWidth }}>
            <Scrollbar height="420px">
              <Submenu items={menus[menuType].items} />
            </Scrollbar>
          </Box>
        )
      default:
        return (
          <Box style={{ width: containerWidth }}>
            <Submenu items={menus[menuType].items} />
          </Box>
        )
    }
  }, [containerWidth, menuType, menus])

  return (
    <div>
      <Card
        size="sm"
        className="flex-col px-4 m-1 mt-2 min-w-[160px] border border-solid border-btn-primary"
      >
        <Box col className="m-2">
          <Box row alignCenter>
            {menuType !== 'main' && (
              <Box
                onClick={onBack}
                className="p-2.5 !mr-2 rounded-2xl hover:bg-btn-light-tint-active dark:hover:bg-btn-dark-tint-active cursor-pointer"
                center
              >
                <Icon name="chevronLeft" />
              </Box>
            )}
            <Typography variant="subtitle2">{menus[menuType].title}</Typography>
          </Box>
        </Box>

        {menuElement}

        <Box justify="end">
          <Typography variant="caption-xs" color="secondary">
            {`v${packageJson.version} (${BUILD_NUMBER})`}
          </Typography>
        </Box>
      </Card>
    </div>
  )
}
