import { Text } from '@chakra-ui/react';
import { FeeOption } from '@swapkit/core';
import { Box, Button, Collapse, Icon, Select } from 'components/Atomic';
import type { InfoRowConfig } from 'components/InfoRow/types';
import { InfoTable } from 'components/InfoTable';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { useFormatPrice } from 'helpers/formatPrice';
import { parseToPercent } from 'helpers/parseHelpers';
import type { MouseEventHandler } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { IS_LEDGER_LIVE } from 'settings/config';
import { useApp } from 'store/app/hooks';

type Props = {
  affiliateBasisPoints: number;
  expectedOutput?: string;
  affiliateFee: number;
  networkFee: number;
  inputUnitPrice: number;
  isLoading: boolean;
  minReceive: string;
  minReceiveSlippage: number;
  outputUnitPrice: number;
  streamSwap: boolean;
  setFeeModalOpened: (isOpened: boolean) => void;
  showTransactionFeeSelect?: boolean;
  whaleDiscount: boolean;
  vTHORDiscount: boolean;
  assets: [string, string];
};
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const feeOptions = [FeeOption.Average, FeeOption.Fast, FeeOption.Fastest];

export const SwapInfo = ({
  affiliateBasisPoints,
  assets: [inputAsset, outputAsset],
  expectedOutput,
  affiliateFee,
  networkFee,
  isLoading,
  streamSwap,
  minReceive,
  minReceiveSlippage,
  setFeeModalOpened,
  showTransactionFeeSelect,
  whaleDiscount,
  vTHORDiscount,
  inputUnitPrice,
  outputUnitPrice,
}: Props) => {
  const { feeOptionType, setFeeOptionType } = useApp();
  const formatPrice = useFormatPrice();
  const [reverted, setReverted] = useState(false);

  const toggle: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    setReverted((r) => !r);
    e.stopPropagation();
  }, []);

  const { rateDesc, ratePrice } = useMemo(() => {
    const [first, second] = [inputUnitPrice, outputUnitPrice].sort(() => (reverted ? 1 : -1));
    const [firstAsset, secondAsset] = [inputAsset, outputAsset].sort(() => (reverted ? 1 : -1));
    const rate = first / second;
    const decimals = rate > 1000 ? 4 : rate > 1 ? 5 : 8;

    return {
      rateDesc: rate > 0 ? `1 ${firstAsset} = ${rate.toFixed(decimals)} ${secondAsset}` : '-',
      ratePrice: `(${formatPrice(inputUnitPrice)})`,
    };
  }, [formatPrice, inputAsset, inputUnitPrice, outputAsset, outputUnitPrice, reverted]);

  const openFeeModal = useCallback(() => {
    if (networkFee + affiliateFee <= 0) return;

    setFeeModalOpened(true);
  }, [networkFee, affiliateFee, setFeeModalOpened]);

  const discountLabel = useMemo(() => {
    if (whaleDiscount && vTHORDiscount) return 'vTHOR + 🐳 Whale 50% Off';
    if (whaleDiscount) return '🐳 Whale 50% Off';
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
        !streamSwap
          ? {
              label: t('views.swap.minReceivedAfterSlip', {
                slippage: minReceiveSlippage > 0 ? parseToPercent(minReceiveSlippage) : '-',
              }),
              value: (
                <InfoWithTooltip
                  tooltip={t('views.wallet.minReceivedTooltip')}
                  value={minReceive}
                />
              ),
            }
          : null,
        showTransactionFeeSelect
          ? {
              key: 'keystoreFee',
              label: t('common.transactionFee'),
              value: (
                <Select
                  activeIndex={feeOptions.indexOf(feeOptionType)}
                  dropdownPlacement="bottom-end"
                  onChange={(index) => setFeeOptionType(feeOptions[index])}
                  options={feeOptions.map(capitalize)}
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
                    <Box row className="gap-1">
                      <Text fontWeight="bold" textStyle="caption-xs" variant="green">
                        {discountLabel}
                      </Text>
                      <Text textStyle="caption-xs" variant="secondary">
                        {t('views.swap.discountApplied')}
                      </Text>
                    </Box>
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
      affiliateBasisPoints,
      affiliateFee,
      discountLabel,
      expectedOutput,
      feeOptionType,
      formatPrice,
      minReceive,
      minReceiveSlippage,
      networkFee,
      openFeeModal,
      setFeeOptionType,
      showTransactionFeeSelect,
      streamSwap,
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
