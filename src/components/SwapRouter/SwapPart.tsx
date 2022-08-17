import { memo } from 'react'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Typography } from 'components/Atomic'
import { normalizedProviderName } from 'components/SwapRouter/ProviderLogos'

type Props = {
  provider: string
  percentage: number
  providerLogoURL?: string
}

export const SwapPart = memo(
  ({ providerLogoURL, provider, percentage }: Props) => {
    return (
      <Box align="end" className="w-full gap-2 p-1.5">
        {providerLogoURL && <AssetIcon size={24} logoURI={providerLogoURL} />}
        <Typography variant="caption" className="text-[11px]">
          {
            (normalizedProviderName[provider.replace('_', '') as 'THORCHAIN'] ||
              provider) as string
          }
          {` - ${percentage}%`}
        </Typography>
      </Box>
    )
  },
)
