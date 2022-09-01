import classNames from 'classnames';
import { Box, Tooltip, Typography } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import { ThemeType } from 'types/app';

type Props = {
  className?: string;
  duration?: number;
  resetIndicator: boolean;
  size?: number;
  onClick?: () => void;
};

export const CountDownIndicator = memo(
  ({ className, resetIndicator, size = 24, duration = 10, onClick }: Props) => {
    const { themeType } = useApp();
    const playing = useRef(false);
    const interval = useRef<NodeJS.Timer>(setTimeout(() => {}, 0));
    const lightTheme = themeType === ThemeType.Light;
    const trailColor = lightTheme ? '#E6E9F5' : '#273855';
    const strokeColor = lightTheme ? '#7C859F' : '#75849D';

    const radius = size / 2;
    const circumference = size * Math.PI;
    const [countdown, setCountdown] = useState(duration);

    const strokeDashoffset =
      circumference - ((countdown * 1000) / (duration * 1000)) * circumference;

    const startTimer = useCallback(() => {
      if (!playing.current) {
        playing.current = true;

        clearInterval(interval.current);
        interval.current = setInterval(() => {
          setCountdown((countdown) => {
            if (countdown > 1) return countdown - 1;

            onClick?.();
            return duration;
          });
        }, 1000);
      }
    }, [duration, onClick]);

    const handleRefresh = useCallback(() => {
      onClick?.();
      setCountdown(duration);
    }, [duration, onClick]);

    useEffect(() => {
      if (resetIndicator) {
        playing.current = false;
        setCountdown(duration);
        startTimer();
      }
    }, [startTimer, resetIndicator, duration]);

    const countdownStyles = useMemo(() => ({ height: size, width: size }), [size]);

    const svgClass = 'left-1.5 top-1.5 absolute w-full h-full overflow-visible';

    return (
      <Tooltip content={t('common.refresh')} place="top">
        <Box
          center
          className={classNames(
            'm-auto relative -rotate-90',
            { [baseHoverClass]: onClick },
            className,
          )}
          onClick={handleRefresh}
          style={countdownStyles}
        >
          <Typography className="rotate-90" variant="caption-xs">
            {countdown.toFixed()}
          </Typography>

          <svg className={svgClass}>
            <circle
              cx={radius}
              cy={radius}
              fill="none"
              r={radius}
              stroke={trailColor}
              strokeWidth={2}
            />
          </svg>

          <svg className={svgClass}>
            <circle
              cx={radius}
              cy={radius}
              fill="none"
              r={radius}
              stroke={strokeColor}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeWidth={2}
            />
          </svg>
        </Box>
      </Tooltip>
    );
  },
);
