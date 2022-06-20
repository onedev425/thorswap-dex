import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import classNames from 'classnames'

import { Box, Tooltip, Typography } from 'components/Atomic'
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
  ({ className, resetIndicator, size = 24, duration = 10, onClick }: Props) => {
    const { themeType } = useApp()
    const playing = useRef(false)
    const interval = useRef<NodeJS.Timer>(setTimeout(() => {}, 1000))
    const lightTheme = themeType === ThemeType.Light
    const trailColor = lightTheme ? '#E6E9F5' : '#273855'
    const strokeColor = lightTheme ? '#7C859F' : '#75849D'

    const milliseconds = duration * 1000
    const radius = size / 2
    const circumference = size * Math.PI
    const [countdown, setCountdown] = useState(milliseconds)

    const strokeDashoffset =
      circumference - (countdown / milliseconds) * circumference

    const startTimer = useCallback(() => {
      if (!playing.current) {
        playing.current = true

        clearInterval(interval.current)
        interval.current = setInterval(() => {
          setCountdown((countdown) => {
            if (countdown <= 1) {
              setCountdown(milliseconds)
              return milliseconds
            }

            return countdown - 1000
          })
        }, 1000)
      }
    }, [milliseconds])

    const handleRefresh = useCallback(() => {
      onClick?.()
      setCountdown(milliseconds)
    }, [milliseconds, onClick])

    useEffect(() => {
      if (resetIndicator) {
        playing.current = false
        startTimer()
      }
    }, [startTimer, resetIndicator])

    const countdownStyles = useMemo(
      () => ({ height: size, width: size }),
      [size],
    )

    const seconds = (countdown / 1000).toFixed()

    const svgClass = 'left-1.5 top-1.5 absolute w-full h-full overflow-visible'

    return (
      <Tooltip content={t('common.refresh')} place="top">
        <Box
          className={classNames(
            'm-auto relative',
            { [baseHoverClass]: onClick },
            className,
          )}
          center
          onClick={handleRefresh}
          style={countdownStyles}
        >
          <Typography variant="caption-xs">{seconds}</Typography>

          <svg className={svgClass}>
            <circle
              cx={radius}
              cy={radius}
              r={radius}
              fill="none"
              stroke={trailColor}
              strokeWidth={2}
            />
          </svg>

          <svg className={svgClass}>
            <circle
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              r={radius}
              cx={radius}
              cy={radius}
              fill="none"
              strokeLinecap="round"
              stroke={strokeColor}
              strokeWidth={2}
            />
          </svg>
        </Box>
      </Tooltip>
    )
  },
)
