import { memo } from 'react'

import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import classNames from 'classnames'

import { Box, Tooltip } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'

import { useApp } from 'store/app/hooks'

import { t } from 'services/i18n'

import { ThemeType } from 'types/app'

type Props = {
  className?: string
  duration?: number
  resetIndicator: boolean
  size?: number
  onClick?: () => void
}

export const CountDownIndicator = memo(
  ({ className, duration = 10, size = 16, resetIndicator, onClick }: Props) => {
    const { themeType } = useApp()
    const lightTheme = themeType === ThemeType.Light
    const trailColor = lightTheme ? '#E6E9F5' : '#273855'
    const strokeColor = lightTheme ? '#7C859F' : '#75849D'

    return (
      <Tooltip content={t('common.refresh')} place="top">
        <Box
          className={classNames(
            'transition-all w-10 h-10',
            { [baseHoverClass]: onClick },
            className,
          )}
          center
          onClick={onClick}
        >
          <CountdownCircleTimer
            isPlaying
            key={`${resetIndicator}`}
            size={size}
            strokeWidth={2}
            trailColor={trailColor}
            duration={duration}
            colors={[strokeColor, strokeColor]}
            colorsTime={[10, 0]}
          >
            {() => null}
          </CountdownCircleTimer>
        </Box>
      </Tooltip>
    )
  },
)
