import { Fragment, memo, useMemo } from 'react'

import classNames from 'classnames'

import { RouterStepProps } from 'views/Swap/types'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { AssetTickerType } from 'components/AssetIcon/types'
import { Box, Card, Icon, Typography, useCollapse } from 'components/Atomic'

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

    const { contentRef, toggle, maxHeightStyle, collapseClasses, isActive } =
      useCollapse()

    return (
      <Card className="self-stretch mt-5 mx-5 md:mx-10 bg-light-gray-light dark:bg-dark-gray-light !rounded-2xl flex-col">
        <Box
          className="cursor-pointer"
          alignCenter
          justify="between"
          onClick={toggle}
        >
          <Box alignCenter>
            <Icon className="mr-4" name="router" size={24} />
            <Typography className="!text-transparent bg-clip-text bg-gradient-to-br from-blue to-cyan">
              {t('views.swap.autoRouter')}
            </Typography>
          </Box>

          <Box className="gap-3" alignCenter>
            <Icon color="secondary" name="infoCircle" size={20} />
            <Icon
              name="chevronDown"
              color="secondary"
              className={classNames(
                'transform duration-300 ease inline-block',
                {
                  '-rotate-180': isActive,
                },
              )}
            />
          </Box>
        </Box>

        <div
          className={collapseClasses}
          ref={contentRef}
          style={maxHeightStyle}
        >
          <Box className="pt-5 flex-wrap" alignCenter justify="between">
            <AssetIcon className="ml-1" name={firstAssetName} />
            <DashedDivider />

            {routerPath.map(({ assets, commission }) => (
              <Fragment key={assets.join()}>
                <RouterStep commission={commission} assets={assets} />

                <DashedDivider />
              </Fragment>
            ))}

            <AssetIcon name={secondAssetName} />
          </Box>
        </div>
      </Card>
    )
  },
)
