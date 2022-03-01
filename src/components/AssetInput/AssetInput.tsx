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
      alignCenter
      justify="between"
      mb={1}
      className={classNames(
        'flex-1 items-center rounded-3xl px-2 gap-2 py-6 md:px-6',
        secondary
          ? 'bg-light-gray-light dark:bg-dark-gray-light'
          : 'bg-light-bg-primary dark:bg-dark-bg-primary',
      )}
    >
      <Box className="flex-1 px-4" col>
        <Input
          className="!text-2xl text-left font-normal -ml-1"
          containerClassName="py-0"
          onChange={(event) => onValueChange(event.target.value)}
          value={selectedAsset?.balance}
          stretch
        />

        <Box className="pt-1 pb-1" alignCenter>
          <Typography color="secondary" fontWeight="semibold">
            {secondaryLabel || '$'}&nbsp;{assetValue.toFixed(2)}
          </Typography>

          {showChange && selectedAsset && (
            <Typography
              color={(selectedAsset?.change || 0) >= 0 ? 'green' : 'red'}
              className="px-1"
            >
              {`(${selectedAsset.change}%)`}
            </Typography>
          )}
        </Box>
      </Box>

      <Box className="pr-2" col>
        <AssetSelect
          className="-ml-4 md:-ml-0"
          assets={assets}
          selected={selectedAsset?.asset}
          commonAssets={commonAssets}
          onSelect={onAssetChange}
        />
      </Box>
    </Box>
  )
}
