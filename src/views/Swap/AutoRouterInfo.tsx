import { Fragment, memo, useMemo } from 'react'

import { RouterStepProps } from 'views/Swap/types'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { AssetTickerType } from 'components/AssetIcon/types'
import { Icon } from 'components/Icon'
import { Typography } from 'components/Typography'

import { t } from 'services/i18n'

import { DashedDivider } from './DashedDivider'
import { RouterStep } from './RouterStep'

type Props = {
  firstAssetName: AssetTickerType
  secondAssetName: AssetTickerType
}

export const AutoRouterInfo = memo(
  ({ firstAssetName, secondAssetName }: Props) => {
    const routerPath = useMemo(
      () =>
        [
          { assets: ['V3'], commission: '100' },
          { assets: ['ETH', 'DOGE'], commission: '0.5' },
          { assets: ['DOGE', secondAssetName], commission: '0.2' },
        ] as RouterStepProps[],
      [secondAssetName],
    )

    return (
      <div className="self-stretch rounded-2xl px-6 py-4 m-8 bg-light-gray-light dark:bg-dark-gray-light">
        <div className="flex items-center">
          <Icon className="mr-4" name="chartCandle" size={24} />
          <Typography>{t('views.swap.autoRouter')}</Typography>

          <Icon
            color="secondary"
            name="infoCircle"
            className="ml-auto"
            size={20}
          />
          <Icon color="secondary" name="close" size={20} className="ml-4" />
        </div>

        <div className="flex items-center justify-between mt-10">
          <AssetIcon name={firstAssetName} />
          <DashedDivider />

          {routerPath.map(({ assets, commission }) => (
            <Fragment key={assets.join()}>
              <RouterStep commission={commission} assets={assets} />

              <DashedDivider />
            </Fragment>
          ))}

          <AssetIcon name={secondAssetName} />
        </div>
      </div>
    )
  },
)
