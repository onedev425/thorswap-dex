import { Text } from '@chakra-ui/react';
import type { QuoteRoute } from '@swapkit/api';
import { SwapKitNumber } from '@swapkit/core';
import { Box, Icon, Tooltip } from 'components/Atomic';
import { useRouteFees } from 'hooks/useRouteFees';
import { memo, useMemo } from 'react';

type Props = {
  fees: QuoteRoute['fees'];
  size?: 'sm' | 'md';
};

export const GasPriceIndicator = memo(({ fees, size = 'md' }: Props) => {
  const { networkFee } = useRouteFees(fees);

  const iconSize = useMemo(() => (size === 'md' ? 14 : 10), [size]);

  if (!networkFee) return null;

  return (
    <Tooltip>
      <Box center>
        <Text
          color="brand.yellow"
          textStyle="caption-xs"
          variant="secondaryBtn"
        >{`$${new SwapKitNumber({
          value: networkFee,
          decimal: 2,
        }).toFixed(2)}`}</Text>
        <Icon className="pl-0.5" color="yellow" name="gas" size={iconSize} />
      </Box>
    </Tooltip>
  );
});
