import classNames from 'classnames'

import { AssetSelect } from 'components/AssetSelect'
import { Box, Typography } from 'components/Atomic'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

import { AssetInputProps } from './types'

export const AssetInput = ({
  className,
  showChange,
  selectedAsset,
  assets,
  commonAssets,
  secondary,
  secondaryLabel,
  onAssetChange,
  onValueChange,
}: AssetInputProps) => {
  const assetValue =
    parseFloat(selectedAsset?.price || '0') *
    parseFloat(selectedAsset?.value || '0')

  return (
    <Box
      col
      justify="between"
      className={classNames(
        className,
        'rounded-2xl md:rounded-3xl md:px-6 pb-3 md:py-4 md:gap-2 border border-solid border-transparent hover:border-light-gray-primary dark:hover:border-dark-gray-primary',
        secondary
          ? 'bg-light-gray-light dark:bg-dark-gray-light'
          : 'bg-light-bg-primary dark:bg-dark-bg-primary',
      )}
    >
      <Box flex={1} className="pb-1 pl-4 md:pl-2" alignCenter>
        <Input
          placeholder="0.0"
          className="-ml-1 !text-2xl font-normal text-left"
          containerClassName="!py-0"
          onChange={(event) => onValueChange(event.target.value)}
          value={selectedAsset?.value}
          stretch
        />

        <AssetSelect
          className="m-2 md:m-0"
          assets={assets}
          selected={selectedAsset?.asset}
          commonAssets={commonAssets}
          onSelect={onAssetChange}
        />
      </Box>

      <Box justify="between" className="pl-4 md:pl-2">
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

        <Typography className="pr-4 md:pr-0" color="secondary">
          {t('common.balance')}: {selectedAsset.balance || 0}
        </Typography>
      </Box>
    </Box>
  )
}
