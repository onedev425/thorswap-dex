import classNames from 'classnames';
import { Box, Typography } from 'components/Atomic';

import { getIntFromName, rainbowStop } from './utils';

type Props = {
  ticker: string;
  size: number;
};

export const FallbackIcon = ({ ticker, size }: Props) => {
  const tickerNums = getIntFromName(ticker);
  const fallbackBgImg = `linear-gradient(45deg, ${rainbowStop(tickerNums[0])}, ${rainbowStop(
    tickerNums[1],
  )})`;

  const isLongTicker = ticker.length > 4;
  const fontSize = size * 0.25;

  return (
    <Box
      alignCenter
      justifyCenter
      className="rounded-full z-10"
      style={{ background: fallbackBgImg, width: size, height: size }}
    >
      <Typography
        className={classNames('-m-1 break-all text-center leading-[10px]', {
          '!font-normal': isLongTicker,
        })}
        style={{ fontSize }}
        variant="caption-xs"
      >
        {ticker}
      </Typography>
    </Box>
  );
};
