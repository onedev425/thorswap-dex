import { Text } from '@chakra-ui/react';
import { Amount, AmountType, AssetEntity } from '@thorswap-lib/swapkit-core';
import BigNumber from 'bignumber.js';
import { AssetIcon } from 'components/AssetIcon';
import { Box } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import { HoverIcon } from 'components/HoverIcon';
import { GasPriceIndicator } from 'components/SwapRouter/GasPriceIndicator';
import { RouteWithApproveType } from 'components/SwapRouter/types';
import { useFormatPrice } from 'helpers/formatPrice';
import { tokenLogoURL } from 'helpers/logoURL';
import { memo, useMemo } from 'react';
import { t } from 'services/i18n';

import { ProviderLogos } from './ProviderLogos';

type Props = RouteWithApproveType & {
  selected?: boolean;
  onClick: () => void;
  outputAsset: AssetEntity;
  unitPrice: BigNumber;
};

export const SwapRoute = memo(
  ({
    expectedOutput,
    streamingSwap,
    onClick,
    isApproved,
    outputAsset,
    unitPrice,
    path,
    providers,
    selected,
    fees,
  }: Props) => {
    const formatPrice = useFormatPrice();
    const [, address] = outputAsset.symbol.split('-');

    const outputValue = useMemo(
      () => streamingSwap?.expectedOutput || expectedOutput,
      [expectedOutput, streamingSwap?.expectedOutput],
    );

    const routeOutput = useMemo(
      () => new Amount(new BigNumber(outputValue), AmountType.ASSET_AMOUNT, outputAsset.decimal),
      [outputValue, outputAsset.decimal],
    );

    const logoURI = tokenLogoURL({
      address,
      identifier: `${outputAsset.L1Chain}.${outputAsset.ticker}`,
    });

    const shortPath = useMemo(() => {
      const pathParts = path.split(' -> ')?.map((part) => part.split('-')?.[0]);
      const [step1, step2, ...rest] = pathParts;

      return rest.length > 1
        ? `${step1} → ${step2} ... ${rest[rest.length - 1]}`
        : pathParts.join(' → ');
    }, [path]);

    const expectedOutputPrice = useMemo(
      () => formatPrice(unitPrice.multipliedBy(outputValue).toNumber()),
      [outputValue, formatPrice, unitPrice],
    );

    return (
      <HighlightCard className="!px-3 !py-1.5 !gap-0" isFocused={selected} onClick={onClick}>
        <Box justify="between">
          <Box className="py-2">
            <ProviderLogos providers={providers} />
            {isApproved && (
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
                  <Text fontWeight="bold">{routeOutput.toSignificant(6)}</Text>

                  <Text>{outputAsset.ticker}</Text>
                  <AssetIcon asset={outputAsset} hasChainIcon={false} logoURI={logoURI} size={18} />
                </Box>

                <Box alignCenter className="gap-x-1" justify="end">
                  <GasPriceIndicator fees={fees} size="sm" />

                  <Text className="text-right" variant="secondary">
                    {expectedOutputPrice}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="px-1 pt-0.5">
          <Text className="!text-[9px]" textStyle="caption-xs" variant="secondary">
            {shortPath}
          </Text>
        </Box>
      </HighlightCard>
    );
  },
);
