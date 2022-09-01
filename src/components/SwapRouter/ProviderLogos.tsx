import { AssetIcon } from 'components/AssetIcon';
import { Box, Typography } from 'components/Atomic';
import { providerLogoURL } from 'helpers/logoURL';
import { Fragment, memo, useCallback, useMemo } from 'react';

type Props = {
  providers: string[];
  size?: number;
};

export const normalizedProviderName = {
  THORCHAIN: 'THORChain',
  ONEINCH: '1inch',
  UNISWAPV2: 'UniswapV2',
  BALANCERV2: 'Balancer',
  UNISWAPV3: 'UniswapV3',
  ZEROX: '0x',
  CURVEV2: 'Curve',
  CURVE: 'Curve',
  SUSHISWAP: 'SushiSwap',
  SUSHI: 'SushiSwap',
  SYNTHETIXATOMIC: 'Syntetix',
};

export const ProviderLogos = memo(({ size = 24, providers }: Props) => {
  const uniswapBadge = useCallback(
    (provider: string) => (provider.toLowerCase().includes('uniswap') ? provider.slice(-2) : ''),
    [],
  );

  const arrowStyle = useMemo(
    () => ({
      fontSize: size * 0.7,
      marginTop: size / 5,
    }),
    [size],
  );
  const providerStyle = useMemo(() => ({ fontSize: size / 3 }), [size]);

  return (
    <Box row className="px-1 max-w-[100px]" flex={1} justify="between">
      {providers.map((provider, index, array) => (
        <Fragment key={provider}>
          <Box center col>
            <AssetIcon
              badge={uniswapBadge(provider)}
              logoURI={providerLogoURL(provider)}
              size={size}
            />

            <Typography
              className="w-14 text-center"
              color="secondary"
              style={providerStyle}
              variant="caption-xs"
            >
              {normalizedProviderName[provider as 'THORCHAIN'] || provider}
            </Typography>
          </Box>

          <Typography style={arrowStyle}>{index !== array.length - 1 && '→'}</Typography>
        </Fragment>
      ))}
    </Box>
  );
});
