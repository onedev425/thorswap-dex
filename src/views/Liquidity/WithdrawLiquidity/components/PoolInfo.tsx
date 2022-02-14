import { PoolAsset } from 'views/Liquidity/WithdrawLiquidity/types'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { AssetLpIcon } from 'components/AssetIcon/AssetLpIcon'
import { Box } from 'components/Box'
import { Typography } from 'components/Typography'

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
        className="border-0 border-dotted border-b border-light-typo-gray dark:border-dark-typo-gray"
        pb={24}
        justify="between"
      >
        <Box alignCenter>
          <AssetLpIcon
            asset1Name={firstAsset.name}
            asset2Name={secondAsset.name}
          />
          <Typography className="ml-4" fontWeight="normal" variant="h5">
            {firstAsset.name}
            {' / '}
            {secondAsset.name}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="semibold">
            {lpAmount}
          </Typography>
          <Typography variant="h5" color="secondary" fontWeight="semibold">
            {'&nbsp;'}
            {t('views.liquidity.poolTokens')}
          </Typography>
        </Box>
      </Box>

      <Box className="gap-4" col mt={32}>
        <Box className="w-full" alignCenter justify="between">
          <Typography color="secondary">
            {t('views.liquidity.yourPoolShare')}
            {':'}
          </Typography>
          <Typography>
            {poolShare}
            {'%'}
          </Typography>
        </Box>
        <Box className="w-full" alignCenter justify="between">
          <Typography color="secondary">
            {firstAsset.name}
            {':'}
          </Typography>
          <Box center>
            <Typography>{firstAsset.balance}</Typography>
            <AssetIcon className="ml-2" name={firstAsset.name} size={32} />
          </Box>
        </Box>
        <Box className="w-full" alignCenter justify="between">
          <Typography color="secondary">
            {secondAsset.name}
            {':'}
          </Typography>
          <Box center>
            <Typography>{secondAsset.balance}</Typography>
            <AssetIcon className="ml-2" name={secondAsset.name} size={32} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
