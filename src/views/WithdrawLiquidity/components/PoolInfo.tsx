import { PoolAsset } from 'views/WithdrawLiquidity/types'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { AssetLpIcon } from 'components/AssetIcon/AssetLpIcon'
import { Box, Typography } from 'components/Atomic'

import { t } from 'services/i18n'

type Props = {
  firstAsset: PoolAsset
  secondAsset: PoolAsset
  poolShare: string
  lpAmount: string
}

export const PoolInfo = ({
  firstAsset,
  secondAsset,
  poolShare,
  lpAmount,
}: Props) => {
  return (
    <Box
      className={
        'self-stretch rounded-3xl py-6 px-6 pt-8 bg-light-gray-light dark:bg-dark-gray-light'
      }
      minHeight={100}
      col
    >
      <Box
        className="flex-wrap border-0 border-b border-dotted gap-x-2 gap-y-4 border-light-typo-gray dark:border-dark-typo-gray"
        pb={24}
        justify="between"
      >
        <Box alignCenter>
          <AssetLpIcon asset1={firstAsset.asset} asset2={secondAsset.asset} />
          <Typography className="ml-4" fontWeight="normal" variant="h5">
            {firstAsset.asset.symbol}
            {' / '}
            {secondAsset.asset.symbol}
          </Typography>
        </Box>
        <Box alignCenter>
          <Typography variant="h5" fontWeight="semibold">
            {lpAmount}
          </Typography>
          <Typography
            variant="subtitle1"
            color="secondary"
            fontWeight="semibold"
          >
            &nbsp;
            {t('views.liquidity.poolTokens')}
          </Typography>
        </Box>
      </Box>

      <Box className="gap-2" col mt={24}>
        <Box className="w-full h-8" alignCenter justify="between">
          <Typography color="secondary">
            {t('views.liquidity.yourPoolShare')}
            {':'}
          </Typography>
          <Typography>
            {poolShare}
            {'%'}
          </Typography>
        </Box>
        <Box className="w-full h-8" alignCenter justify="between">
          <Typography color="secondary">
            {firstAsset.asset.symbol}
            {':'}
          </Typography>
          <Box center>
            <Typography>{firstAsset.balance}</Typography>
            <AssetIcon className="ml-2" asset={firstAsset.asset} size={32} />
          </Box>
        </Box>
        <Box className="w-full h-8" alignCenter justify="between">
          <Typography color="secondary">
            {secondAsset.asset.symbol}
            {':'}
          </Typography>
          <Box center>
            <Typography>{secondAsset.balance}</Typography>
            <AssetIcon className="ml-2" asset={secondAsset.asset} size={32} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
