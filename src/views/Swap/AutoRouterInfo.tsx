import { memo, useMemo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { RouterStepProps } from 'views/Swap/types'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Box, Card, Icon, Typography, useCollapse } from 'components/Atomic'

import { t } from 'services/i18n'

import { DashedDivider } from './DashedDivider'
import { RouterStep } from './RouterStep'

type Props = {
  firstAsset: Asset
  secondAsset: Asset
}

export const AutoRouterInfo = memo(({ firstAsset, secondAsset }: Props) => {
  const routerPath = useMemo(
    () =>
      [
        { assets: [Asset.RUNE(), Asset.DOGE()], commission: '0.5' },
        { assets: [Asset.DOGE(), secondAsset], commission: '0.2' },
      ] as RouterStepProps[],
    [secondAsset],
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
            className={classNames('transform duration-300 ease inline-block', {
              '-rotate-180': isActive,
            })}
          />
        </Box>
      </Box>

      <div className={collapseClasses} ref={contentRef} style={maxHeightStyle}>
        <Box className="flex-wrap pt-5 gap-y-2" alignCenter>
          <AssetIcon className="ml-1" asset={firstAsset} />

          {routerPath.map(({ assets, commission }) => (
            <Box
              className="flex-1 !min-w-[120px] !max-w-[130px] md:!max-w-[200px]"
              key={assets.join()}
              alignCenter
              justify="between"
            >
              <DashedDivider />
              <RouterStep commission={commission} assets={assets} />
            </Box>
          ))}

          <Box className="flex-1 max-w-[70px] md:!max-w-[150px]" alignCenter>
            <DashedDivider />
            <AssetIcon asset={secondAsset} />
          </Box>
        </Box>
      </div>
    </Card>
  )
})
