import { Text } from '@chakra-ui/react';
import { QuoteRoute } from '@thorswap-lib/swapkit-api';
import { formatBigNumber } from '@thorswap-lib/swapkit-core';
import BigNumber from 'bignumber.js';
import { Box, Icon, Tooltip } from 'components/Atomic';
import { useRouteFees } from 'hooks/useRouteFees';
import { memo, useMemo } from 'react';

type Props = {
  fees: QuoteRoute['fees'];
  size?: 'sm' | 'md';
};

export const GasPriceIndicator = memo(({ fees, size = 'md' }: Props) => {
  const { outOfPocketFee } = useRouteFees(fees);

  const iconSize = useMemo(() => (size === 'md' ? 14 : 10), [size]);

  if (!outOfPocketFee) return null;

  return (
    <Tooltip>
      <Box center>
        <Text textStyle="caption-xs" variant="secondaryBtn">{`$${formatBigNumber(
          BigNumber(outOfPocketFee),
          2,
        )}`}</Text>
        <Icon className="pl-0.5" color="secondaryBtn" name="gas" size={iconSize} />
      </Box>
    </Tooltip>
  );
});
