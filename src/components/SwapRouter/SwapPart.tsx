import { Text } from '@chakra-ui/react';
import { AssetIcon } from 'components/AssetIcon';
import { Box } from 'components/Atomic';
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
      <Text className="text-[11px]" textStyle="caption">
        {(normalizedProviderName[provider.replace('_', '') as 'THORCHAIN'] || provider) as string}
        {` - ${percentage}%`}
      </Text>
    </Box>
  );
});
