import { useCallback } from 'react'

import classNames from 'classnames'

import { AssetSelect } from 'components/AssetSelect'
import { AssetSelectButton } from 'components/AssetSelect/AssetSelectButton'
import { Box, Button, Typography } from 'components/Atomic'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

import { AssetInputProps } from './types'

export const AssetInput = ({
  singleAsset,
  className,
  showChange,
  selectedAsset,
  assets,
  commonAssets,
  secondary,
  secondaryLabel,
  onAssetChange,
  onValueChange,
  hideMaxButton,
}: AssetInputProps) => {
  const assetValue =
    parseFloat(selectedAsset?.price || '0') *
    parseFloat(selectedAsset?.value || '0')

  const handleMaxClick = useCallback(() => {
    onValueChange(selectedAsset.balance || '0')
  }, [onValueChange, selectedAsset.balance])

  return (
    <Box
      col
      justify="between"
      className={classNames(
        className,
        'rounded-2xl md:rounded-3xl md:px-6 pb-3 md:py-4 md:gap-2 border border-solid border-transparent hover:border-light-gray-primary dark:hover:border-dark-gray-primary transition duration-300',
        secondary
          ? 'bg-light-gray-light dark:bg-dark-gray-light'
          : 'bg-light-bg-primary dark:bg-dark-bg-primary',
      )}
    >
      <Box flex={1} className="pb-1 pl-4 md:pl-0" alignCenter>
        <Input
          placeholder="0.0"
          className="-ml-1 !text-2xl font-normal text-left"
          containerClassName="!py-0"
          onChange={(event) => onValueChange(event.target.value)}
          value={selectedAsset?.value}
          stretch
        />

        {singleAsset ? (
          <AssetSelectButton
            className="pr-3 m-2 md:m-0"
            selected={selectedAsset?.asset}
          />
        ) : (
          <AssetSelect
            className="m-2 md:m-0"
            assets={assets}
            selected={selectedAsset?.asset}
            commonAssets={commonAssets}
            onSelect={onAssetChange}
          />
        )}
      </Box>

      <Box className="pl-4 md:pl-0" alignCenter justify="between">
        <Box>
          <Typography color="secondary" fontWeight="semibold">
            {secondaryLabel || '$'}&nbsp;{assetValue.toFixed(2)}
          </Typography>

          {showChange && selectedAsset && (
            <Typography
              color={(selectedAsset?.change || 0) >= 0 ? 'green' : 'red'}
              className="pl-1"
            >
              {`(${selectedAsset.change}%)`}
            </Typography>
          )}
        </Box>

        <Box className="gap-1" center row>
          <Typography
            className="pr-4 md:pr-0"
            color="secondary"
            fontWeight="semibold"
          >
            {t('common.balance')}: {selectedAsset.balance || 0}
          </Typography>

          {!hideMaxButton && (
            <Button
              className="!h-5 !px-1.5"
              size="sm"
              type="borderless"
              variant="secondary"
              transform="uppercase"
              onClick={handleMaxClick}
            >
              {t('common.max')}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}
