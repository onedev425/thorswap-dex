import { Text } from '@chakra-ui/react';
import { Amount, AmountType, AssetEntity, Percent, QuoteRoute } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { Box, Button } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { useFormatPrice } from 'helpers/formatPrice';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import { useIsAssetApproved } from 'views/Swap/hooks/useIsAssetApproved';

import { ProviderLogos } from './ProviderLogos';
import { RouteGraphModal } from './RouteGraphModal';

type Props = QuoteRoute & {
  outputAssetDecimal: number;
  unitPrice: BigNumber;
  slippage: Percent;
  assetTicker: string;
  inputAsset: AssetEntity;
};

export const SelectedRoute = memo(
  ({
    expectedOutput,
    swaps,
    outputAssetDecimal,
    unitPrice,
    optimal,
    path,
    providers,
    slippage,
    assetTicker,
    inputAsset,
    contract,
  }: Props) => {
    const [isOpened, setIsOpened] = useState(false);
    const { slippageTolerance } = useApp();
    const formatPrice = useFormatPrice();

    const { isApproved, isWalletConnected } = useIsAssetApproved({
      contract,
      asset: inputAsset,
    });

    const expectedAssetOutput = useMemo(
      () =>
        formatPrice(
          new Amount(new BigNumber(expectedOutput), AmountType.ASSET_AMOUNT, outputAssetDecimal),
          { prefix: '' },
        ),
      [expectedOutput, formatPrice, outputAssetDecimal],
    );

    const expectedPriceOutput = useMemo(
      () => formatPrice(unitPrice.multipliedBy(expectedOutput).toNumber()),
      [expectedOutput, formatPrice, unitPrice],
    );

    const slippageInfo = slippage.gt(0) ? `-${slippage.toFixed(2)}` : '-';

    const openSwapGraph = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      setIsOpened(true);
    }, []);

    const approved =
      isWalletConnected &&
      [Chain.Ethereum, Chain.Avalanche].includes(inputAsset.L1Chain) &&
      isApproved;
    return (
      <Box col className="relative" flex={1}>
        <Box
          center
          className={classNames(
            'opacity-0 absolute rounded-sm px-4 transition-all bg-btn-secondary-translucent group-hover:bg-transparent w-fit -right-7',
            { '!opacity-100': optimal },
          )}
        >
          <Text textStyle="caption-xs">{t('common.optimal')}</Text>
        </Box>

        <Box col className="pl-4 py-1">
          <Box justify="between">
            <Box className="py-2">
              <ProviderLogos providers={providers} size={32} />

              {approved && (
                <Box className={providers.length > 1 ? 'ml-12' : 'ml-2'}>
                  <HoverIcon iconName="approved" size={22} />
                </Box>
              )}
            </Box>

            <Box col className="pr-2" justify="end">
              <Box className="gap-x-1" justify="end">
                <Text>{expectedAssetOutput}</Text>
                <Text>{assetTicker}</Text>
              </Box>

              <Box alignCenter className="gap-x-1">
                <Text
                  textStyle="caption"
                  variant={slippage.gte(slippageTolerance / 100) ? 'red' : 'green'}
                >
                  ({slippageInfo})
                </Text>
                <Text variant="secondary">{expectedPriceOutput}</Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Button
              className="h-6 px-3 w-fit"
              onClick={openSwapGraph}
              tooltip={t('views.swap.swapPath')}
              variant="tint"
            >
              <Text textStyle="caption-xs" variant="secondary">
                {t('common.path')}: {path.replaceAll('->', '→')}
              </Text>
            </Button>
          </Box>
        </Box>

        <RouteGraphModal isOpened={isOpened} onClose={() => setIsOpened(false)} swaps={swaps} />
      </Box>
    );
  },
);
