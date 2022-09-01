import { AssetIcon } from 'components/AssetIcon';
import { Box, Typography } from 'components/Atomic';
import { normalizedProviderName } from 'components/SwapRouter/ProviderLogos';
import { memo } from 'react';

type Props = {
  provider: string;
  percentage: number;
  providerLogoURL?: string;
};

export const SwapPart = memo(({ providerLogoURL, provider, percentage }: Props) => {
  return (
    <Box align="end" className="w-full gap-2 p-1.5">
      {providerLogoURL && <AssetIcon logoURI={providerLogoURL} size={24} />}
      <Typography className="text-[11px]" variant="caption">
        {(normalizedProviderName[provider.replace('_', '') as 'THORCHAIN'] || provider) as string}
        {` - ${percentage}%`}
      </Typography>
    </Box>
  );
});
