import { Fragment, memo, useMemo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { RouterStepProps } from 'views/Swap/types'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Box, Collapse, Icon, Typography } from 'components/Atomic'

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

  return (
    <Collapse
      className="!py-2 self-stretch mt-5 !bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl flex-col"
      shadow={false}
      title={
        <Box className="cursor-pointer" alignCenter justify="between">
          <Box mr={2} alignCenter>
            <Icon className="mr-2" name="router" size={16} />
            <Typography
              className="!text-transparent bg-clip-text bg-gradient-to-br from-blue to-cyan"
              variant="caption"
              fontWeight="normal"
            >
              {t('views.swap.autoRouter')}
            </Typography>
          </Box>
        </Box>
      }
    >
      <div className="self-stretch w-full py-4 rounded-2xl">
        <Box alignCenter justify="between">
          <AssetIcon className="ml-1" asset={firstAsset} />
          <DashedDivider />

          {routerPath.map(({ assets, commission }) => (
            <Fragment key={assets.join()}>
              <RouterStep commission={commission} assets={assets} />

              <DashedDivider />
            </Fragment>
          ))}

          <AssetIcon asset={secondAsset} />
        </Box>
      </div>
    </Collapse>
  )
})
