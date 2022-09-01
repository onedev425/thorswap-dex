import { AssetIcon } from 'components/AssetIcon';
import { Box, Typography } from 'components/Atomic';
import { SwapGraphType } from 'components/SwapRouter/types';
import { memo } from 'react';

import { SwapPart } from './SwapPart';

type Props = SwapGraphType[number]['chainSwaps'][number][number];

export const SwapGraph = memo(({ fromAsset, toAsset, swapParts }: Props) => {
  return (
    <Box col className="w-full">
      <Box center row className="gap-2 py-2">
        <AssetIcon logoURI={fromAsset.logoURL} size={24} />
        <Typography className="text-[18px]">→</Typography>
        <AssetIcon logoURI={toAsset.logoURL} size={24} />
      </Box>

      <Box
        col
        className="border border-solid rounded-xl border-light-border-primary dark:border-dark-border-primary"
      >
        {swapParts.map((part) => (
          <SwapPart key={`${part.provider}-${part.percentage}`} {...part} />
        ))}
      </Box>
    </Box>
  );
});
