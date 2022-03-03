import classNames from 'classnames'

import { AssetSelect } from 'components/AssetSelect'
import { Box, Typography } from 'components/Atomic'
import { Input } from 'components/Input'

import { AssetInputProps } from './types'

export const AssetInput = ({
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
    parseFloat(selectedAsset?.value || '0') *
    parseFloat(selectedAsset?.balance || '0')

  return (
    <Box
      col
      justify="between"
      mb={1}
      className={classNames(
        'rounded-3xl md:px-6 pb-3 md:py-4 md:gap-2',
        secondary
          ? 'bg-light-gray-light dark:bg-dark-gray-light'
          : 'bg-light-bg-primary dark:bg-dark-bg-primary',
      )}
    >
      <Box flex={1} className="pl-4">
        <Input
          className="text-xl md:text-2xl text-left font-normal -ml-1"
          containerClassName="py-0"
          onChange={(event) => onValueChange(event.target.value)}
          value={selectedAsset?.balance}
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

      <Box col className="pl-4">
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
      </Box>
    </Box>
  )
}
