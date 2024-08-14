import { Flex } from "@chakra-ui/react";
import { ProviderName } from "@swapkit/sdk";
import classNames from "classnames";
import { AssetIcon } from "components/AssetIcon";
import { Box, Tooltip } from "components/Atomic";
import { providerLogoURL } from "helpers/logoURL";
import { memo, useMemo } from "react";

type Props = {
  className?: string;
  providers: string[];
  size?: number;
};

export const normalizedProviderName = {
  MAYACHAIN: "MAYAChain",
  MAYACHAIN_STREAMING: "MAYAChain Streaming",
  THORCHAIN: "THORChain",
  THORCHAIN_STREAMING: "THORChain Streaming",
  CHAINFLIP: "Chainflip",
  ONEINCH: "1inch",
  UNISWAP: "UniswapV1",
  UNISWAP_V1: "UniswapV1",
  UNISWAPV2: "UniswapV2",
  Uniswap_V2: "UniswapV2",
  KYBERSWAP: "KyberSwap",
  KYBERSWAPV2: "KyberSwapV2",
  KYBERSWAP_V2: "KyberSwapV2",
  TRADERJOE: "TraderJoe",
  PLATYPUS: "Platypus",
  PANGOLIN_V1: "Pangolin",
  BALANCERV2: "Balancer",
  UNISWAPV3: "UniswapV3",
  Uniswap_V3: "UniswapV3",
  ZEROX: "0x",
  CURVEV2: "CurveV2",
  Curve_V2: "CurveV2",
  CURVE: "Curve",
  SUSHISWAP: "SushiSwap",
  SUSHISWAP_V2: "SushiSwap",
  SUSHI: "SushiSwap",
  SYNTHETIXATOMIC: "Syntetix",
  SYNTHETIX_ATOMIC_SIP288: "Syntetix",
  KYBERSWAPELASTIC: "KyberSwap",
  SYNAPSE: "Synapse",
  TRADERJOE_V2: "TraderJoe",
  AVALANCHE_TRADERJOE_V2: "TraderJoe",
  "WOOFI-AVAX": "WOOFI",
};

export const ProviderLogos = memo(({ className, size = 24, providers }: Props) => {
  const shortenProviders = useMemo(() => providers.map((p) => p.split("-")[0]), [providers]);

  return (
    <Flex className="px-1 max-w-[100px]" flex={1} flexDirection="row-reverse" justify="between">
      {shortenProviders.map((provider, index) => {
        const providerDisplayName = normalizedProviderName[provider as "THORCHAIN"] || provider;
        const firstItem = index === 0;

        return (
          <Box
            className={classNames(className, {
              "z-10": firstItem,
              "-z-0 -ml-2": !firstItem,
            })}
            key={provider}
          >
            <Tooltip content={providerDisplayName}>
              <AssetIcon
                logoURI={providerLogoURL(provider)}
                size={size}
                secondaryIcon={
                  [ProviderName.MAYACHAIN_STREAMING, ProviderName.THORCHAIN_STREAMING].includes(
                    provider as ProviderName,
                  )
                    ? "dollarOutlined"
                    : undefined
                }
              />
            </Tooltip>
          </Box>
        );
      })}
    </Flex>
  );
});
