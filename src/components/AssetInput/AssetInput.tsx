import { Amount, Asset } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetSelect } from 'components/AssetSelect';
import { AssetSelectButton } from 'components/AssetSelect/AssetSelectButton';
import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import { InputAmount } from 'components/InputAmount';
import { useFormatPrice } from 'helpers/formatPrice';
import { useCallback, useMemo } from 'react';
import { t } from 'services/i18n';

import { AssetInputProps } from './types';

export const AssetInput = ({
  hideZeroPrice,
  className,
  singleAsset,
  selectedAsset,
  secondaryLabel,
  onValueChange,
  hideMaxButton,
  inputClassName,
  disabled = false,
  warning,
  maxButtonLabel,
  poolAsset,
  showSecondaryChainSelector,
  ...rest
}: AssetInputProps) => {
  const formatPrice = useFormatPrice();
  const {
    asset,
    value = Amount.fromAssetAmount(0, asset.decimal),
    usdPrice,
    balance,
    loading,
    priceLoading,
  } = selectedAsset;

  const localPriceLoading = useMemo(
    () => (typeof priceLoading === 'boolean' ? priceLoading : loading),
    [priceLoading, loading],
  );

  const assetPriceInUSD = useMemo(
    () =>
      (hideZeroPrice && usdPrice?.lt(1)) || !usdPrice?.gte(-1)
        ? null
        : usdPrice?.toCurrencyFormat(2),
    [hideZeroPrice, usdPrice],
  );

  const handleMaxClick = useCallback(() => {
    onValueChange?.(balance || Amount.fromAssetAmount(0, asset.decimal));
  }, [onValueChange, asset, balance]);

  const assetSelectProps = useMemo(
    () => ({
      ...rest,
      onSelect: rest.onAssetChange as (asset: Asset) => void,
      showAssetType: true,
    }),
    [rest],
  );

  const inputStyle = useMemo(() => {
    const rawValue = formatPrice(value);
    const fontSize =
      rawValue.length > 30
        ? '1rem'
        : rawValue.length > 25
        ? '1.2rem'
        : rawValue.length > 20
        ? '1.4rem'
        : '1.5rem';

    return { fontSize, lineHeight: '2rem' };
  }, [formatPrice, value]);

  return (
    <HighlightCard className={classNames('min-h-[70px] text-2 !gap-1 !justify-start', className)}>
      <Box
        alignCenter
        className={classNames('pl-4 md:pl-0', className, {
          'flex-col md:flex-row': showSecondaryChainSelector,
          'flex-row': !showSecondaryChainSelector,
        })}
      >
        {loading ? (
          <div className="flex w-full">
            <Icon spin color="primary" name="loader" size={16} />
          </div>
        ) : (
          <InputAmount
            stretch
            amountValue={value}
            className={classNames('-ml-1 font-normal text-left', inputClassName)}
            containerClassName="!py-0"
            customPrefix={
              warning ? (
                <Tooltip content={warning}>
                  <Icon className="mr-2" color="yellow" name="warn" size={24} />
                </Tooltip>
              ) : null
            }
            disabled={disabled}
            onAmountChange={onValueChange}
            style={inputStyle}
          />
        )}

        {singleAsset ? (
          <Box className="w-full" justify="end">
            <AssetSelectButton
              showAssetType
              className="pr-3 m-2 md:m-1"
              selected={selectedAsset?.asset}
            />
            {showSecondaryChainSelector && (
              <AssetSelect
                {...assetSelectProps}
                showAssetType
                className="pr-3 m-2 md:m-1"
                selected={poolAsset?.asset}
              />
            )}
          </Box>
        ) : (
          <AssetSelect
            {...assetSelectProps}
            className="m-2 md:m-0"
            selected={selectedAsset?.asset}
          />
        )}
      </Box>

      <Box alignCenter className="pl-4 md:pl-0" flex={1} justify="between">
        <Box className="min-h-[21px]">
          {localPriceLoading ? (
            <Icon spin className="flex w-full" color="primary" name="loader" size={12} />
          ) : assetPriceInUSD ? (
            <Typography color="secondary" fontWeight="semibold">
              {secondaryLabel || `${assetPriceInUSD}`}
            </Typography>
          ) : null}
        </Box>

        <Box center row className="gap-1 pb-2 pr-2 md:pr-0">
          {balance && (
            <Typography color="secondary" fontWeight="medium">
              {t('common.balance')}: {balance?.toSignificantWithMaxDecimals(6) || '0'}
            </Typography>
          )}

          {(balance || !hideMaxButton) && !disabled && (
            <Button
              className="!h-5 !px-1.5"
              onClick={handleMaxClick}
              transform="uppercase"
              type="outline"
              variant="secondary"
            >
              {maxButtonLabel || t('common.max')}
            </Button>
          )}
        </Box>
      </Box>
    </HighlightCard>
  );
};
