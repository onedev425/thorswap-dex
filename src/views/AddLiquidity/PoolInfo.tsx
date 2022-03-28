import { AssetInputType } from 'components/AssetInput/types'
import { Box, Collapse, Icon, Typography } from 'components/Atomic'

import { t } from 'services/i18n'

type Props = {
  firstAsset: AssetInputType
  secondAsset: AssetInputType
  poolShare: number
  firstToSecondRate: number
}

export const PoolInfo = ({
  firstAsset,
  secondAsset,
  poolShare,
  firstToSecondRate,
}: Props) => {
  return (
    <Collapse
      className="!py-2 self-stretch !mt-0 !bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl flex-col"
      shadow={false}
      title={
        <div className="flex flex-row gap-x-2">
          <Icon name="infoCircle" size={16} color="secondary" />

          <Typography variant="caption" color="primary" fontWeight="normal">
            {t('views.addLiquidity.pricesAndPoolShare')}
          </Typography>
        </div>
      }
    >
      <Box className="w-full" row>
        <Box
          className="flex-1 gap-2 border-0 border-r border-dotted border-light-typo-gray dark:border-dark-typo-gray"
          col
        >
          <Typography variant="caption" color="secondary" fontWeight="semibold">
            {firstAsset.asset.symbol}
            {` ${t('common.per')} `}
            {secondAsset.asset.symbol}
          </Typography>
          <Typography variant="h4">{firstToSecondRate}</Typography>
        </Box>

        <Box
          className="flex-1 gap-2 text-center border-0 border-r border-dotted border-light-typo-gray dark:border-dark-typo-gray"
          col
        >
          <Typography variant="caption" color="secondary" fontWeight="semibold">
            {secondAsset.asset.symbol}
            {` ${t('common.per')} `}
            {firstAsset.asset.symbol}
          </Typography>
          <Typography variant="h4">{1 / firstToSecondRate}</Typography>
        </Box>

        <Box className="flex-1 gap-2 text-right" col>
          <Typography variant="caption" color="secondary" fontWeight="semibold">
            {t('views.addLiquidity.shareOfPool')}
          </Typography>
          <Typography variant="h4">{`${poolShare}%`}</Typography>
        </Box>
      </Box>
    </Collapse>
  )
}
