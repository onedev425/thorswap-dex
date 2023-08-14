import { Text } from '@chakra-ui/react';
import { Price } from '@thorswap-lib/swapkit-core';
import { FeeOption } from '@thorswap-lib/types';
import { Box, Button, Collapse, Icon, Select } from 'components/Atomic';
import { InfoRowConfig } from 'components/InfoRow/types';
import { InfoTable } from 'components/InfoTable';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { useFormatPrice } from 'helpers/formatPrice';
import { parseToPercent } from 'helpers/parseHelpers';
import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { IS_LEDGER_LIVE } from 'settings/config';
import { useApp } from 'store/app/hooks';

type Props = {
  affiliateBasisPoints: number;
  expectedOutput?: string;
  affiliateFee: number;
  networkFee: number;
  inputUSDPrice: Price;
  isLoading: boolean;
  minReceive: string;
  minReceiveSlippage: number;
  outputUSDPrice: Price;
  setFeeModalOpened: (isOpened: boolean) => void;
  showTransactionFeeSelect?: boolean;
  whaleDiscount: boolean;
  vTHORDiscount: boolean;
};
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const feeOptions = [FeeOption.Average, FeeOption.Fast, FeeOption.Fastest];

export const SwapInfo = ({
  affiliateBasisPoints,
  expectedOutput,
  affiliateFee,
  networkFee,
  inputUSDPrice,
  isLoading,
  minReceive,
  minReceiveSlippage,
  outputUSDPrice,
  setFeeModalOpened,
  showTransactionFeeSelect,
  whaleDiscount,
  vTHORDiscount,
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
    () => feeOptions.map((feeOption) => t(`common.fee${capitalize(feeOption)}`)),
    [],
  );

  const activeFeeIndex =
    feeOptionLabels.findIndex((o) => o.includes(t(`common.fee${capitalize(feeOptionType)}`))) || 0;

  const discountLabel = useMemo(() => {
    if (whaleDiscount && vTHORDiscount) return 'vTHOR + 🐳 Whale';
    if (whaleDiscount) return '🐳 Whale';
    if (vTHORDiscount) return 'vTHOR';
    return '';
  }, [vTHORDiscount, whaleDiscount]);

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
            slippage: minReceiveSlippage > 0 ? parseToPercent(minReceiveSlippage) : '-',
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
                  dropdownPlacement="bottom-end"
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
              <Text fontWeight="medium" textStyle="caption" variant="secondary">
                {t('views.wallet.networkFee')}
              </Text>
              {!IS_LEDGER_LIVE && (
                <Box center>
                  <Text
                    className="italic underline"
                    fontWeight="normal"
                    textStyle="caption-xs"
                    variant="secondary"
                  >
                    details
                  </Text>

                  <Icon className="mx-1" color="secondary" name="eye" size={16} />
                </Box>
              )}
            </Box>
          ),
          onClick: openFeeModal,
          value: (
            <InfoWithTooltip
              tooltip={t('views.swap.networkFeeTooltip')}
              value={
                <Box center>
                  <Text textStyle="caption">{formatPrice(networkFee)}</Text>
                </Box>
              }
            />
          ),
        },
        {
          label: t('views.swap.exchangeFee'),
          value: (
            <InfoWithTooltip
              tooltip={
                affiliateBasisPoints
                  ? t('views.swap.affiliateFee', {
                      percent: `${(affiliateBasisPoints / 100).toFixed(2)}%`,
                    })
                  : ''
              }
              value={
                <Box center row className="gap-1">
                  {discountLabel && (
                    <Text textStyle="caption-xs" variant="secondary">
                      {discountLabel} {t('views.swap.discountApplied')}
                    </Text>
                  )}

                  {affiliateFee ? (
                    <Text textStyle="caption">{formatPrice(affiliateFee)}</Text>
                  ) : (
                    <Text fontWeight="bold" textStyle="caption" variant="green">
                      FREE
                    </Text>
                  )}
                </Box>
              }
            />
          ),
        },
      ].filter(Boolean) as InfoRowConfig[],
    [
      activeFeeIndex,
      affiliateBasisPoints,
      affiliateFee,
      discountLabel,
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
        <Box alignCenter className="gap-1 flex-1" justify="between">
          <Button
            className="!p-1 !h-auto"
            leftIcon={<Icon name="switch" size={16} />}
            onClick={toggle}
            tooltip={t('views.swap.swapAssets')}
            variant="outlinePrimary"
          />
          {isLoading ? (
            <Box alignCenter className="px-2" flex={1} justify="start">
              <Icon spin name="loader" size={14} />
            </Box>
          ) : (
            <Box alignCenter className="gap-x-1 flex-wrap flex-1 pl-1">
              <Box center className="gap-1.5">
                <Text fontWeight="normal" textStyle="caption" variant="primary">
                  {rateDesc}
                </Text>
              </Box>
              <Text fontWeight="normal" textStyle="caption" variant="secondary">
                {ratePrice}
              </Text>
            </Box>
          )}

          <Box className="pr-1">
            <Button
              className="h-[30px] px-2"
              leftIcon={<Icon color="secondary" name="fees" size={18} />}
              tooltip={t('views.swap.totalFeeTooltip')}
              variant="tint"
            >
              <Text>{formatPrice(networkFee + affiliateFee)}</Text>
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
