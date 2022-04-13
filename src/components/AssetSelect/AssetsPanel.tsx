import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetButton } from 'components/AssetSelect/AssetButton'
import { Box, Typography } from 'components/Atomic'

type Props = {
  assets: Asset[]
  onSelect: (val: Asset) => void
  emptyTitle?: string
}

export const AssetsPanel = ({ assets, emptyTitle, onSelect }: Props) => {
  return (
    <Box className="flex-1 flex-wrap gap-2 pt-2" center>
      {!assets.length && emptyTitle && (
        <Box className="h-[40px] flex-1" center>
          <Typography>{emptyTitle}</Typography>
        </Box>
      )}
      {assets.map((item) => (
        <Box key={item.symbol}>
          <AssetButton
            className="bg-opacity-70 dark:bg-opacity-70"
            onClick={() => onSelect(item)}
            asset={item}
            size="sm"
          />
        </Box>
      ))}
    </Box>
  )
}
