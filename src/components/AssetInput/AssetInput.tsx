import { memo } from 'react'

import classNames from 'classnames'

import { AssetSelect } from 'components/AssetSelect'
import { Box } from 'components/Box'
import { Input } from 'components/Input'
import { Typography } from 'components/Typography'

import { AssetInputProps } from './types'

export const AssetInput = memo(
  ({
    showChange,
    selectedAsset,
    assets,
    commonAssets,
    onValueChange,
    onAssetChange,
    secondary,
    secondaryLabel,
  }: AssetInputProps) => {
    const assetValue =
      parseFloat(selectedAsset?.value || '0') *
      parseFloat(selectedAsset?.balance || '0')

    return (
      <Box
        row
        alignCenter
        justify="between"
        mb={1}
        className={classNames(
          'rounded-3xl py-6 md:py-4 px-3 md:px-6',
          secondary
            ? 'bg-light-gray-light dark:bg-dark-gray-light'
            : 'bg-light-bg-primary dark:bg-dark-bg-primary',
        )}
      >
        <div>
          <Input
            stretch
            borderless
            className="!text-2xl"
            onChange={(event) => onValueChange(event.target.value)}
            value={selectedAsset?.balance}
          />

          <div className="flex items-center">
            <Typography color="secondary" variant="caption">
              {secondaryLabel || '$'}&nbsp;{assetValue.toFixed(2)}
            </Typography>

            {showChange && selectedAsset && (
              <Typography
                color={(selectedAsset?.change || 0) >= 0 ? 'green' : 'red'}
                fontWeight="semibold"
                className="ml-2"
              >
                {`(${selectedAsset.change}%)`}
              </Typography>
            )}
          </div>
        </div>

        <AssetSelect
          className="ml-4 md:ml-auto"
          selected={selectedAsset?.name}
          assets={assets}
          commonAssets={commonAssets}
          onSelect={onAssetChange}
        />
      </Box>
    )
  },
)
