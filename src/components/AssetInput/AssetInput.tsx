import { useCallback, useMemo } from 'react'

import { Amount, Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetSelect } from 'components/AssetSelect'
import { AssetSelectButton } from 'components/AssetSelect/AssetSelectButton'
import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'
import { InputAmount } from 'components/InputAmount'

import { t } from 'services/i18n'

import { useFormatPrice } from 'helpers/formatPrice'

import { AssetInputProps } from './types'

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
  const formatPrice = useFormatPrice()
  const {
    asset,
    value = Amount.fromAssetAmount(0, asset.decimal),
    usdPrice,
    balance,
    loading,
    priceLoading,
  } = selectedAsset

  const localPriceLoading = useMemo(
    () => (typeof priceLoading === 'boolean' ? priceLoading : loading),
    [priceLoading, loading],
  )

  const assetPriceInUSD = useMemo(
    () =>
      hideZeroPrice && usdPrice?.lt(1) ? null : usdPrice?.toCurrencyFormat(2),
    [hideZeroPrice, usdPrice],
  )

  const handleMaxClick = useCallback(() => {
    onValueChange?.(balance || Amount.fromAssetAmount(0, asset.decimal))
  }, [onValueChange, asset, balance])

  const assetSelectProps = useMemo(
    () => ({
      ...rest,
      onSelect: rest.onAssetChange as (asset: Asset) => void,
      showAssetType: true,
    }),
    [rest],
  )

  const inputStyle = useMemo(() => {
    const rawValue = formatPrice(value)
    const fontSize =
      rawValue.length > 30
        ? '1rem'
        : rawValue.length > 25
        ? '1.2rem'
        : rawValue.length > 20
        ? '1.4rem'
        : '1.5rem'

    return { fontSize, lineHeight: '2rem' }
  }, [formatPrice, value])

  return (
    <HighlightCard
      className={classNames(
        'min-h-[70px] text-2 !gap-1 !justify-start',
        className,
      )}
    >
      <Box
        className={classNames('pl-4 md:pl-0', className, {
          'flex-col md:flex-row': showSecondaryChainSelector,
          'flex-row': !showSecondaryChainSelector,
        })}
        alignCenter
      >
        {loading ? (
          <div className="flex w-full">
            <Icon name="loader" spin size={16} color="primary" />
          </div>
        ) : (
          <InputAmount
            className={classNames(
              '-ml-1 font-normal text-left',
              inputClassName,
            )}
            style={inputStyle}
            containerClassName="!py-0"
            onAmountChange={onValueChange}
            amountValue={value}
            stretch
            disabled={disabled}
            customPrefix={
              warning ? (
                <Tooltip content={warning}>
                  <Icon className="mr-2" name="warn" color="yellow" size={24} />
                </Tooltip>
              ) : null
            }
          />
        )}

        {singleAsset ? (
          <Box justify="end" className="w-full">
            <AssetSelectButton
              className="pr-3 m-2 md:m-1"
              selected={selectedAsset?.asset}
              showAssetType
            />
            {showSecondaryChainSelector && (
              <AssetSelect
                {...assetSelectProps}
                className="pr-3 m-2 md:m-1"
                selected={poolAsset?.asset}
                showAssetType
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

      <Box className="pl-4 md:pl-0" alignCenter justify="between" flex={1}>
        <Box>
          {localPriceLoading ? (
            <Icon
              className="flex w-full"
              name="loader"
              spin
              size={10}
              color="primary"
            />
          ) : assetPriceInUSD ? (
            <Typography color="secondary" fontWeight="semibold">
              {secondaryLabel || `${assetPriceInUSD}`}
            </Typography>
          ) : null}
        </Box>

        <Box className="gap-1 pb-2 pr-2 md:pr-0" center row>
          {balance && (
            <Typography color="secondary" fontWeight="medium">
              {t('common.balance')}: {balance?.toSignificant(6) || '0'}
            </Typography>
          )}

          {(balance || !hideMaxButton) && !disabled && (
            <Button
              className="!h-5 !px-1.5"
              type="outline"
              variant="secondary"
              transform="uppercase"
              onClick={handleMaxClick}
            >
              {maxButtonLabel || t('common.max')}
            </Button>
          )}
        </Box>
      </Box>
    </HighlightCard>
  )
}
