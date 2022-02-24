import classNames from 'classnames'

import { AssetLpIcon } from 'components/AssetIcon/AssetLpIcon'
import { AssetTickerType } from 'components/AssetIcon/types'
import { Box, Typography } from 'components/Atomic'

import { RouterStepProps } from './types'

export const RouterStep = ({ assets, commission }: RouterStepProps) => {
  const [firstAssetOrRouter, secondAsset] = assets

  return (
    <Box
      className={classNames(
        'p-1 pr-2 md:pr-4 rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary',
      )}
      alignCenter
    >
      {secondAsset ? (
        <AssetLpIcon
          inline
          asset1Name={firstAssetOrRouter as AssetTickerType}
          asset2Name={secondAsset}
          size={32}
        />
      ) : (
        <div
          className={classNames(
            'rounded-3xl w-8 h-8 inline-flex justify-center items-center',
            'bg-light-gray-light dark:bg-dark-gray-light',
          )}
        >
          <Typography color="secondary">{firstAssetOrRouter}</Typography>
        </div>
      )}

      <Typography className="ml-2" color="secondary">
        {`${commission}%`}
      </Typography>
    </Box>
  )
}
