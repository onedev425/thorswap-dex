import { Percent, Price } from '@thorswap-lib/multichain-core';
import { FeeOption } from '@thorswap-lib/types';
import { Box, Button, Collapse, Icon, Select, Typography } from 'components/Atomic';
import { InfoRowConfig } from 'components/InfoRow/types';
import { InfoTable } from 'components/InfoTable';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { useFormatPrice } from 'helpers/formatPrice';
import capitalize from 'lodash/capitalize';
import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import { gasFeeMultiplier } from 'views/Swap/hooks/useSwap';

type Props = {
  expectedOutput?: string;
  affiliateFee: number;
  networkFee: number;
  inputUSDPrice: Price;
  isLoading: boolean;
  gasPrice?: number;
  minReceive: string;
  minReceiveSlippage: Percent;
  outputUSDPrice: Price;
  setFeeModalOpened: (isOpened: boolean) => void;
  showTransactionFeeSelect?: boolean;
};

const feeOptions = [FeeOption.Average, FeeOption.Fast, FeeOption.Fastest];

export const SwapInfo = ({
  expectedOutput,
  affiliateFee,
  networkFee,
  inputUSDPrice,
  isLoading,
  gasPrice,
  minReceive,
  minReceiveSlippage,
  outputUSDPrice,
  setFeeModalOpened,
  showTransactionFeeSelect,
}: Props) => {
  const { feeOptionType, setFeeOptionType } = useApp();
  const formatPrice = useFormatPrice();
  const [reverted, setReverted] = useState(false);

  const toggle: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    setReverted((r) => !r);
    e.stopPropagation();
  }, []);

  const [first, second] = reverted
    ? [outputUSDPrice, inputUSDPrice]
    : [inputUSDPrice, outputUSDPrice];

  const rateDesc = useMemo(() => {
    const rate = first.unitPrice.dividedBy(second.unitPrice);
    const decimals = rate.gte(1000) ? 4 : rate.gte(1) ? 5 : 8;

    return rate.gt(0)
      ? `1 ${first.baseAsset.ticker} = ${rate.toFixed(decimals)} ${second.baseAsset.ticker}`
      : '-';
  }, [first.baseAsset.ticker, first.unitPrice, second.baseAsset.ticker, second.unitPrice]);

  const openFeeModal = useCallback(() => {
    if (networkFee + affiliateFee <= 0) return;

    setFeeModalOpened(true);
  }, [networkFee, affiliateFee, setFeeModalOpened]);

  const ratePrice = `($${formatPrice(first.unitPrice.toFixed(2))})`;

  const feeOptionLabels = useMemo(
    () =>
      feeOptions.map(
        (feeOption) =>
          `${t(`common.fee${capitalize(feeOption)}`)}\n(${formatPrice(
            (gasPrice || 0) * gasFeeMultiplier[feeOption],
          )})`,
      ),
    [formatPrice, gasPrice],
  );

  const activeFeeIndex =
    feeOptionLabels.findIndex((o) => o.includes(t(`common.fee${capitalize(feeOptionType)}`))) || 0;

  const rows = useMemo(
    () =>
      [
        {
          label: t('views.wallet.expectedOutput'),
          value: (
            <InfoWithTooltip
              tooltip={t('views.wallet.expectedOutputTooltip')}
              value={expectedOutput}
            />
          ),
        },
        {
          label: t('views.swap.minReceivedAfterSlip', {
            slippage: minReceiveSlippage.gte(0) ? minReceiveSlippage.toFixed(2) : '-',
          }),
          value: (
            <InfoWithTooltip tooltip={t('views.wallet.minReceivedTooltip')} value={minReceive} />
          ),
        },
        showTransactionFeeSelect
          ? {
              key: 'keystoreFee',
              label: t('common.transactionFee'),
              value: (
                <Select
                  activeIndex={activeFeeIndex}
                  onChange={(index) => setFeeOptionType(feeOptions[index])}
                  options={feeOptionLabels}
                  size="sm"
                />
              ),
            }
          : null,
        {
          label: (
            <Box center className="gap-2 group">
              <Typography color="secondary" fontWeight="medium" variant="caption">
                {t('views.wallet.networkFee')}
              </Typography>
              <Box center>
                <Typography
                  className="italic underline"
                  color="secondary"
                  fontWeight="normal"
                  variant="caption-xs"
                >
                  details
                </Typography>

                <Icon className="mx-1" color="secondary" name="eye" size={16} />
              </Box>
            </Box>
          ),
          onClick: openFeeModal,
          value: (
            <InfoWithTooltip
              tooltip={t('views.swap.networkFeeTooltip')}
              value={
                <Box center>
                  <Typography variant="caption">{formatPrice(networkFee)}</Typography>
                </Box>
              }
            />
          ),
        },
        {
          label: t('views.swap.exchangeFee'),
          value: (
            <InfoWithTooltip
              tooltip={t('views.swap.affiliateFee')}
              value={
                <Box center row className="gap-1">
                  {affiliateFee ? (
                    <Typography variant="caption">{formatPrice(affiliateFee)}</Typography>
                  ) : (
                    <Typography color="green" fontWeight="bold" variant="caption">
                      FREE
                    </Typography>
                  )}
                </Box>
              }
            />
          ),
        },
      ].filter(Boolean) as InfoRowConfig[],
    [
      activeFeeIndex,
      affiliateFee,
      expectedOutput,
      feeOptionLabels,
      formatPrice,
      minReceive,
      minReceiveSlippage,
      networkFee,
      openFeeModal,
      setFeeOptionType,
      showTransactionFeeSelect,
    ],
  );

  return (
    <Collapse
      className="self-stretch mt-5 !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl flex-col"
      shadow={false}
      title={
        <Box className="gap-1 flex-1" justify="between">
          <Button
            className="!p-1 !h-auto"
            onClick={toggle}
            startIcon={<Icon name="switch" size={16} />}
            tooltip={t('views.swap.swapAssets')}
            type="outline"
          />
          {isLoading ? (
            <Box alignCenter className="px-2" flex={1} justify="start">
              <Icon spin name="loader" size={14} />
            </Box>
          ) : (
            <Box alignCenter className="gap-x-1 flex-wrap flex-1 pl-1">
              <Box center className="gap-1.5">
                <Typography color="primary" fontWeight="normal" variant="caption">
                  {rateDesc}
                </Typography>
              </Box>
              <Typography color="secondary" fontWeight="normal" variant="caption">
                {ratePrice}
              </Typography>
            </Box>
          )}

          <Box className="pr-1">
            <Button
              className="h-[30px] px-2"
              startIcon={<Icon color="secondary" name="fees" size={18} />}
              tooltip={t('views.swap.totalFeeTooltip')}
              variant="tint"
            >
              <Typography>{formatPrice(networkFee)}</Typography>
            </Button>
          </Box>
        </Box>
      }
      titleClassName="pr-1"
    >
      <Box col className="w-full">
        <InfoTable items={rows} />
      </Box>
    </Collapse>
  );
};
