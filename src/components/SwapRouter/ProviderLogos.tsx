import { Text } from '@chakra-ui/react';
import { AssetIcon } from 'components/AssetIcon';
import { Box } from 'components/Atomic';
import { providerLogoURL } from 'helpers/logoURL';
import { Fragment, memo, useCallback, useMemo } from 'react';

type Props = {
  providers: string[];
  size?: number;
};

export const normalizedProviderName = {
  THORCHAIN: 'THORChain',
  ONEINCH: '1inch',
  UNISWAP: 'UniswapV1',
  UNISWAP_V1: 'UniswapV1',
  UNISWAPV2: 'UniswapV2',
  Uniswap_V2: 'UniswapV2',
  KYBERSWAP: 'KyberSwap',
  KYBERSWAPV2: 'KyberSwapV2',
  KYBERSWAP_V2: 'KyberSwapV2',
  TRADERJOE: 'TraderJoe',
  PLATYPUS: 'Platypus',
  BALANCERV2: 'Balancer',
  UNISWAPV3: 'UniswapV3',
  Uniswap_V3: 'UniswapV3',
  ZEROX: '0x',
  CURVEV2: 'CurveV2',
  Curve_V2: 'CurveV2',
  CURVE: 'Curve',
  SUSHISWAP: 'SushiSwap',
  SUSHI: 'SushiSwap',
  SYNTHETIXATOMIC: 'Syntetix',
  SYNTHETIX_ATOMIC_SIP288: 'Syntetix',
  KYBERSWAPELASTIC: 'KyberSwap',
  SYNAPSE: 'Synapse',
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
  const shortenProviders = useMemo(() => providers.map((p) => p.split('-')[0]), [providers]);

  return (
    <Box row className="px-1 max-w-[100px]" flex={1} justify="between">
      {shortenProviders.map((provider, index, array) => {
        const providerDisplayName = normalizedProviderName[provider as 'THORCHAIN'] || provider;

        return (
          <Fragment key={provider}>
            <Box center col>
              <AssetIcon
                badge={uniswapBadge(provider)}
                logoURI={providerLogoURL(provider)}
                size={size}
              />

              <Text
                className="text-center"
                style={{
                  ...providerStyle,
                  fontSize:
                    providerDisplayName.length > 8
                      ? providerStyle.fontSize * 0.9
                      : providerStyle.fontSize,
                }}
                textStyle="caption-xs"
                variant="secondary"
              >
                {providerDisplayName}
              </Text>
            </Box>

            <Text style={arrowStyle}>{index !== array.length - 1 && '→'}</Text>
          </Fragment>
        );
      })}
    </Box>
  );
});
