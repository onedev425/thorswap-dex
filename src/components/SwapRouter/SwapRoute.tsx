import { Amount, AmountType, Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import BigNumber from 'bignumber.js';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Typography } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import { HoverIcon } from 'components/HoverIcon';
import { useFormatPrice } from 'helpers/formatPrice';
import { tokenLogoURL } from 'helpers/logoURL';
import { memo, useMemo } from 'react';
import { t } from 'services/i18n';
import { useIsAssetApproved } from 'views/Swap/hooks/useIsAssetApproved';

import { ProviderLogos } from './ProviderLogos';

type Props = {
  selected?: boolean;
  onClick: () => void;
  selectedQuoteDiff: number;
  outputAsset: Asset;
  unitPrice: BigNumber;
  expectedOutput: string;
  path: string;
  providers: string[];
  contract: string;
  inputAsset: Asset;
};

export const SwapRoute = memo(
  ({
    expectedOutput,
    onClick,
    selectedQuoteDiff,
    outputAsset,
    unitPrice,
    path,
    providers,
    selected,
    contract,
    inputAsset,
  }: Props) => {
    const formatPrice = useFormatPrice();
    const [, address] = outputAsset.symbol.split('-');
    const { isApproved } = useIsAssetApproved({
      contract,
      asset: inputAsset,
    });

    const routeOutput = useMemo(
      () => new Amount(new BigNumber(expectedOutput), AmountType.ASSET_AMOUNT, outputAsset.decimal),
      [expectedOutput, outputAsset.decimal],
    );

    const logoURI = tokenLogoURL({
      provider: providers[0],
      address,
      identifier: `${outputAsset.L1Chain}.${outputAsset.ticker}`,
    });

    const shortPath = useMemo(() => {
      const [step1, step2, ...rest] = path.split(' -> ');

      return rest.length > 1
        ? `${step1} → ${step2}... → ${rest[rest.length - 1]}`
        : path.replaceAll('->', '→');
    }, [path]);

    const expectedOutputPrice = useMemo(
      () => formatPrice(unitPrice.multipliedBy(expectedOutput).toNumber()),
      [expectedOutput, formatPrice, unitPrice],
    );

    const approved = [Chain.Ethereum, Chain.Avalanche].includes(inputAsset.L1Chain) && isApproved;

    return (
      <HighlightCard className="!px-3 !py-1.5 !gap-0" isFocused={selected} onClick={onClick}>
        <Box justify="between">
          <Box className="py-2">
            <ProviderLogos providers={providers} />
            {approved && (
              <Box className={providers.length > 1 ? 'ml-6' : ''}>
                <HoverIcon
                  iconName="approved"
                  size={18}
                  tooltip={t('views.swap.routeContractApproved')}
                />
              </Box>
            )}
          </Box>

          <Box align="end" justify="between">
            <Box center className="gap-x-1.5">
              <Box col>
                <Box className="gap-x-1" justify="end">
                  <Typography fontWeight="bold">{routeOutput.toSignificant(6)}</Typography>

                  <Typography>{outputAsset.ticker}</Typography>
                  <AssetIcon asset={outputAsset} hasChainIcon={false} logoURI={logoURI} size={18} />
                </Box>

                <Box alignCenter className="gap-x-1" justify="end">
                  {Number.isFinite(selectedQuoteDiff) && selectedQuoteDiff !== 0 && (
                    <Typography
                      className="!text-[10px] text-right"
                      color={selectedQuoteDiff >= 0 ? 'green' : 'red'}
                      variant="caption-xs"
                    >
                      ({selectedQuoteDiff.toFixed(2)}%)
                    </Typography>
                  )}
                  <Typography className="text-right" color="secondary">
                    {expectedOutputPrice}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="px-1 pt-0.5">
          <Typography className="!text-[9px]" color="secondary" variant="caption-xs">
            {shortPath}
          </Typography>
        </Box>
      </HighlightCard>
    );
  },
);
