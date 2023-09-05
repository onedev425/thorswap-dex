import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box } from 'components/Atomic';
import type { ReactNode } from 'react';

import { getIntFromName, rainbowStop } from './utils';

type Props = {
  ticker?: string;
  size: number;
  bg?: string;
  icon?: ReactNode;
};

export const FallbackIcon = ({ ticker = '', size, bg, icon }: Props) => {
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
      style={{ background: bg || fallbackBgImg, width: size, height: size }}
    >
      {icon ? (
        icon
      ) : (
        <Text
          className={classNames('-m-1 break-all text-center leading-[10px]', {
            '!font-normal': isLongTicker,
          })}
          style={{ fontSize }}
          textStyle="caption-xs"
        >
          {ticker}
        </Text>
      )}
    </Box>
  );
};
