import { Text } from '@chakra-ui/react';
import { QuoteRoute } from '@thorswap-lib/swapkit-api';
import { getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Modal } from 'components/Atomic';
import { SwapGraph } from 'components/SwapRouter/SwapGraph';
import { chainName } from 'helpers/chainName';
import { providerLogoURL, tokenLogoURL } from 'helpers/logoURL';
import { Fragment, memo, useMemo } from 'react';
import { t } from 'services/i18n';

import { normalizedProviderName } from './ProviderLogos';
import { SwapGraphType } from './types';

type QuoteSwaps = QuoteRoute['swaps'];

type Props = {
  isOpened: boolean;
  onClose: () => void;
  swaps: QuoteSwaps;
};

const parseToSwapItem = ({ address, identifier }: { address?: string; identifier: string }) => ({
  identifier,
  logoURL: tokenLogoURL({ address, identifier }),
});

export const RouteGraphModal = memo(({ isOpened, onClose, swaps }: Props) => {
  const swapGraph = useMemo(
    () =>
      Object.entries(swaps).reduce((acc, [chain, value]) => {
        const name = chainName(chain, true);
        const chainAsset = getSignatureAssetFor(chain as Chain);
        const chainSwaps = (value as QuoteSwaps[string]).map((swapParts) =>
          // @ts-expect-error
          swapParts.map(({ from, to, parts, fromTokenAddress, toTokenAddress }) => ({
            fromAsset: parseToSwapItem({ address: fromTokenAddress, identifier: from }),
            toAsset: parseToSwapItem({ address: toTokenAddress, identifier: to }),
            swapParts: parts
              .concat()
              .sort((a, b) => b.percentage - a.percentage)
              .map(({ percentage, provider }) => ({
                percentage,
                providerLogoURL: provider ? providerLogoURL(provider) : '',
                provider: (normalizedProviderName[provider as 'THORCHAIN'] || provider) as string,
              })),
          })),
        );

        acc.push({
          name,
          chainSwaps,
          logoURL: tokenLogoURL({ identifier: `${chainAsset.chain}.${chainAsset.ticker}` }),
        });
        return acc;
      }, [] as SwapGraphType),
    [swaps],
  );

  return (
    <Modal isOpened={isOpened} onClose={onClose} title={t('common.swapPath')}>
      <Box className="gap-x-4 max-h-[80vh] max-w-[80vw]">
        {swapGraph.map(({ name, logoURL, chainSwaps }, index) => (
          <div key={name}>
            <Box center>
              <Box col>
                <Box alignCenter className="gap-2 pb-2">
                  {logoURL && <AssetIcon logoURI={logoURL} size={28} />}
                  <Text textStyle="subtitle2">{name}</Text>
                </Box>

                <Box alignCenter col flex={1}>
                  {chainSwaps.map((swaps) => (
                    <Box
                      alignCenter
                      row
                      className="gap-6"
                      key={`${swaps[0].fromAsset.identifier}-${swaps[0].toAsset.identifier}`}
                    >
                      {swaps.map((swapGraph, index) => (
                        <Fragment
                          key={`${swapGraph.fromAsset.identifier}-${swapGraph.toAsset.identifier}`}
                        >
                          <SwapGraph {...swapGraph} />

                          {index !== swaps.length - 1 && <Text className="text-[24px]">→</Text>}
                        </Fragment>
                      ))}
                    </Box>
                  ))}
                </Box>
              </Box>

              {index !== swapGraph.length - 1 && <Text className="text-[34px]">→</Text>}
            </Box>
          </div>
        ))}
      </Box>
    </Modal>
  );
});
