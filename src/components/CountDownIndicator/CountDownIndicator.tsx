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

const svgClass =
  'left-0 top-0 absolute w-full h-full overflow-visible -rotate-[90deg]'

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

        interval.current = setInterval(() => {
          setCountdown((countdown) => {
            if (countdown <= 0) {
              setCountdown(milliseconds)
              clearInterval(interval.current)
              return milliseconds
            }

            return countdown - 1000
          })
        }, 1000)
      }
    }, [milliseconds])

    useEffect(() => {
      startTimer()
    }, [startTimer, resetIndicator])

    const countdownStyles = useMemo(
      () => ({ height: size, width: size }),
      [size],
    )

    const seconds = (countdown / 1000).toFixed()

    return (
      <Tooltip content={t('common.refresh')} place="top">
        <Box
          className={classNames(
            'm-auto relative',
            { [baseHoverClass]: onClick },
            className,
          )}
          center
          onClick={onClick}
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
