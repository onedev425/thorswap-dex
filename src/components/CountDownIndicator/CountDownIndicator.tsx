import { memo } from 'react'

import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import classNames from 'classnames'

import { Box } from 'components/Atomic'

import { useApp } from 'redux/app/hooks'

import { ThemeType } from 'types/global'

type Props = {
  duration?: number
  resetIndicator: boolean
  size?: number
  className?: string
}

export const CountDownIndicator = memo(
  ({ className, duration = 10, size = 16, resetIndicator }: Props) => {
    const { themeType } = useApp()
    const lightTheme = themeType === ThemeType.Light
    const trailColor = lightTheme ? '#E6E9F5' : '#273855'
    const strokeColor = lightTheme ? '#7C859F' : '#75849D'

    return (
      <Box className={classNames('transition-all px-1.5', className)}>
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
    )
  },
)
