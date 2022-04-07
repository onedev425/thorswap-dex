import { useCallback, useMemo } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetSelect } from 'components/AssetSelect'
import { AssetSelectButton } from 'components/AssetSelect/AssetSelectButton'
import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'
import { InputAmount } from 'components/InputAmount'

import { t } from 'services/i18n'

import { AssetInputProps } from './types'

export const AssetInput = ({
  className,
  singleAsset,
  selectedAsset,
  assets = [],
  commonAssets = [],
  secondaryLabel,
  onAssetChange,
  onValueChange,
  hideMaxButton,
  inputClassName,
  disabled = false,
  warning,
  maxButtonLabel,
}: AssetInputProps) => {
  const {
    asset,
    value = Amount.fromAssetAmount(0, asset.decimal),
    usdPrice,
    balance,
  } = selectedAsset

  const assetPriceInUSD = useMemo(() => {
    return usdPrice?.toCurrencyFormat(2)
  }, [usdPrice])

  const handleMaxClick = useCallback(() => {
    onValueChange?.(balance || Amount.fromAssetAmount(0, asset.decimal))
  }, [onValueChange, asset, balance])

  return (
    <HighlightCard
      className={classNames('min-h-[107px] !gap-1 !justify-start', className)}
    >
      <Box className="pl-4 md:pl-0" alignCenter>
        <InputAmount
          className={classNames(
            '-ml-1 !text-2xl font-normal text-left',
            inputClassName,
          )}
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

        {singleAsset ? (
          <AssetSelectButton
            className="pr-3 m-2 md:m-0"
            selected={selectedAsset?.asset}
            showAssetType
          />
        ) : (
          <AssetSelect
            className="m-2 md:m-0"
            assets={assets}
            selected={selectedAsset?.asset}
            commonAssets={commonAssets}
            onSelect={onAssetChange}
            showAssetType
          />
        )}
      </Box>

      <Box className="pl-4 md:pl-0" alignCenter justify="between" flex={1}>
        <Box>
          {assetPriceInUSD && (
            <Typography color="secondary" fontWeight="semibold">
              {secondaryLabel || `${assetPriceInUSD}`}
            </Typography>
          )}
        </Box>

        <Box className="gap-1 pr-2 md:pr-0" center row>
          {balance && (
            <Typography color="secondary" fontWeight="medium">
              {t('common.balance')}: {balance?.toSignificant(6) || '0'}
            </Typography>
          )}

          {balance && !hideMaxButton && !disabled && (
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
