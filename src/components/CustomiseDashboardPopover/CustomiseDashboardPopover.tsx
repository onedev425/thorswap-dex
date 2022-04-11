import { useAppPopoverMenu } from 'components/AppPopoverMenu/useAppPopoverMenu'
import {
  Box,
  Button,
  Card,
  Icon,
  SwitchToggle,
  Typography,
} from 'components/Atomic'
import { Popover } from 'components/Popover'

import { useApp } from 'store/app/hooks'

import { t } from 'services/i18n'

export const CustomiseDashboardPopover = () => {
  const { onBack } = useAppPopoverMenu()
  const {
    setStatsShowStatus,
    areStatsShown,
    setChartsShowStatus,
    areChartsShown,
    setPoolsShowStatus,
    arePoolsShown,
  } = useApp()

  return (
    <Popover
      trigger={
        <Button
          className="px-2"
          type="borderless"
          variant="tint"
          startIcon={<Icon name="multiSettings" />}
          tooltip={t('common.globalSettings')}
        />
      }
      onClose={onBack}
    >
      <Card
        className="mt-1 min-w-[90px] sm:w-[280px] border border-solid border-btn-primary"
        size="sm"
      >
        <Box className="w-full" col margin={2}>
          <Box
            alignCenter
            marginBottom={2}
            className="pl-2 py-4 gap-x-2 dark:bg-btn-dark-tint rounded-2xl"
          >
            <SwitchToggle
              checked={areStatsShown}
              onChange={() => setStatsShowStatus(!areStatsShown)}
            />
            <Typography variant="caption">
              {!areStatsShown ? t('appMenu.hideStats') : t('appMenu.showStats')}
            </Typography>
          </Box>
          <Box
            alignCenter
            marginBottom={2}
            className="pl-2 py-4 gap-x-2 dark:bg-btn-dark-tint rounded-2xl"
          >
            <SwitchToggle
              checked={areChartsShown}
              onChange={() => setChartsShowStatus(!areChartsShown)}
            />
            <Typography variant="caption">
              {!areChartsShown
                ? t('appMenu.hideCharts')
                : t('appMenu.showCharts')}
            </Typography>
          </Box>
          <Box
            alignCenter
            marginBottom={2}
            className="pl-2 py-4 gap-x-2 dark:bg-btn-dark-tint rounded-2xl"
          >
            <SwitchToggle
              checked={arePoolsShown}
              onChange={() => setPoolsShowStatus(!arePoolsShown)}
            />
            <Typography variant="caption">
              {!arePoolsShown ? t('appMenu.hidePools') : t('appMenu.showPools')}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Popover>
  )
}
