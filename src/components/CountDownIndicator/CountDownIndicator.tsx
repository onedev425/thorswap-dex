import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import { Box, Tooltip } from "components/Atomic";
import { baseHoverClass } from "components/constants";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { t } from "services/i18n";
import { useApp } from "store/app/hooks";
import { useGetGasHistoryQuery } from "store/thorswap/api";
import { ThemeType } from "types/app";

type Props = {
  className?: string;
  duration?: number;
  size?: number;
  refresh?: () => void;
};

export const CountDownIndicator = memo(
  ({ className, size = 24, duration = 10, refresh }: Props) => {
    const { themeType } = useApp();
    const { refetch: refetchGasHistory } = useGetGasHistoryQuery();
    const playing = useRef(false);
    const interval = useRef<NodeJS.Timeout>(setTimeout(() => undefined, 0));
    const lightTheme = themeType === ThemeType.Light;
    const trailColor = lightTheme ? "#E6E9F5" : "#273855";
    const strokeColor = lightTheme ? "#7C859F" : "#75849D";

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

            refresh?.();
            refetchGasHistory();
            return duration;
          });
        }, 1000);
      }
    }, [duration, refresh, refetchGasHistory]);

    const handleRefresh = useCallback(() => {
      refresh?.();
      refetchGasHistory();
      setCountdown(duration);
    }, [duration, refresh, refetchGasHistory]);

    useEffect(() => {
      setCountdown(duration);
      playing.current = !refresh;

      if (refresh) {
        startTimer();
      } else {
        clearInterval(interval.current);
      }
    }, [startTimer, duration, refresh]);

    const countdownStyles = useMemo(() => ({ height: size, width: size }), [size]);

    const svgClass = "left-1.5 top-1.5 absolute w-full h-full overflow-visible";

    return (
      <Tooltip content={t("common.refresh")} place="top">
        <Box
          center
          className={classNames(
            "m-auto relative -rotate-90 box-content",
            baseHoverClass,
            className,
          )}
          onClick={handleRefresh}
          style={countdownStyles}
        >
          <Text className="rotate-90" textStyle="caption-xs">
            {countdown.toFixed()}
          </Text>

          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
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

          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
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
