import { memo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'
import { assetsFixture, commonAssets } from 'utils/assetsFixture'

import { AssetInput } from 'components/AssetInput'
import { AssetInputType } from 'components/AssetInput/types'
import { Box, Icon } from 'components/Atomic'

import { t } from 'services/i18n'

type Props = {
  onAssetChange: (assetPosition: 'first' | 'second') => (asset: Asset) => void
  onValueChange: (assetPosition: 'first' | 'second') => (value: string) => void
  firstAsset: AssetInputType
  secondAsset: AssetInputType
}

export const AssetInputs = memo(
  ({ firstAsset, secondAsset, onValueChange, onAssetChange }: Props) => {
    return (
      <Box className="relative" col>
        <Box
          className={classNames(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'p-1 md:p-2 rounded-2xl md:rounded-3xl',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-light-border-primary',
          )}
        >
          <Icon
            className={classNames('w-[24px] h-[24px] md:w-[36px] md:h-[36px]')}
            name="plus"
            color="white"
          />
        </Box>

        <AssetInput
          className="!mb-1"
          selectedAsset={firstAsset}
          onAssetChange={onAssetChange('first')}
          onValueChange={onValueChange('first')}
          assets={assetsFixture}
          commonAssets={commonAssets}
          secondary
          secondaryLabel={t('common.value')}
        />
        <AssetInput
          selectedAsset={secondAsset}
          onAssetChange={onAssetChange('second')}
          onValueChange={onValueChange('second')}
          assets={assetsFixture}
          commonAssets={commonAssets}
          secondary
          secondaryLabel={t('common.value')}
        />
      </Box>
    )
  },
)
