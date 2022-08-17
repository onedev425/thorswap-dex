import { memo } from 'react'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Typography } from 'components/Atomic'
import { SwapGraphType } from 'components/SwapRouter/types'

import { SwapPart } from './SwapPart'

type Props = SwapGraphType[number]['chainSwaps'][number][number]

export const SwapGraph = memo(({ fromAsset, toAsset, swapParts }: Props) => {
  return (
    <Box col className="w-full">
      <Box row center className="gap-2 py-2">
        <AssetIcon size={24} logoURI={fromAsset.logoURL} />
        <Typography className="text-[18px]">→</Typography>
        <AssetIcon size={24} logoURI={toAsset.logoURL} />
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
  )
})
