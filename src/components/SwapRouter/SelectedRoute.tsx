import { Text } from '@chakra-ui/react';
import { SwapKitNumber } from '@swapkit/core';
import classNames from 'classnames';
import { Box, Button } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { GasPriceIndicator } from 'components/SwapRouter/GasPriceIndicator';
import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { useFormatPrice } from 'helpers/formatPrice';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';

import { ProviderLogos } from './ProviderLogos';
import { RouteGraphModal } from './RouteGraphModal';

type Props = RouteWithApproveType & {
  outputAssetDecimal: number;
  unitPrice: number;
  inputUnitPrice: number;
  assetTicker: string;
  streamSwap?: boolean;
};

export const SelectedRoute = memo(
  ({
    expectedOutput,
    streamingSwap,
    swaps,
    outputAssetDecimal,
    unitPrice,
    inputUnitPrice,
    optimal,
    path,
    providers,
    isApproved,
    assetTicker,
    fees,
    streamSwap,
  }: Props) => {
    const [isOpened, setIsOpened] = useState(false);
    const formatPrice = useFormatPrice();
    const outputValue = useMemo(
      () => parseFloat((streamSwap && streamingSwap?.expectedOutput) || expectedOutput),
      [expectedOutput, streamSwap, streamingSwap?.expectedOutput],
    );

    const expectedAssetOutput = useMemo(
      () => formatPrice(new SwapKitNumber({ value: outputValue, decimal: outputAssetDecimal })),
      [formatPrice, outputAssetDecimal, outputValue],
    );

    const expectedPriceOutput = useMemo(
      () => formatPrice(unitPrice * outputValue),
      [outputValue, formatPrice, unitPrice],
    );

    const openSwapGraph = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      setIsOpened(true);
    }, []);

    const shortPath = useMemo(() => {
      const pathParts = path.split(' -> ')?.map((part) => part.split('-')?.[0]);
      const [step1, step2, ...rest] = pathParts;

      return rest.length > 1
        ? `${step1} → ${step2} ... ${rest[rest.length - 1]}`
        : pathParts.join(' → ');
    }, [path]);

    const parsedFees = useMemo(() => {
      return fees.FLIP
        ? {
            FLIP: fees.FLIP.map((fee) => ({
              ...fee,
              totalFeeUSD: fee.totalFee * inputUnitPrice,
              networkFeeUSD: fee.networkFee * inputUnitPrice,
            })),
          }
        : fees;
    }, [fees, inputUnitPrice]);

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
            <Box className="pt-3">
              <ProviderLogos className="pb-3" providers={providers} size={30} />

              {isApproved && <HoverIcon iconName="approved" size={22} />}
            </Box>

            <Box col className="pr-2" justify="end">
              <Box className="gap-x-1" justify="end">
                <Text>{new SwapKitNumber(expectedAssetOutput).toSignificant(6)}</Text>
                <Text>{assetTicker}</Text>
              </Box>

              <Box alignCenter className="gap-x-1">
                <GasPriceIndicator
                  // @ts-expect-error
                  fees={parsedFees}
                />
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
                {t('common.path')}: {shortPath}
              </Text>
            </Button>
          </Box>
        </Box>
        {swaps && (
          <RouteGraphModal isOpened={isOpened} onClose={() => setIsOpened(false)} swaps={swaps} />
        )}
      </Box>
    );
  },
);
