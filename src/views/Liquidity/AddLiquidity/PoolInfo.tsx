import { AssetInputType } from 'components/AssetInput/types'
import { Box, Typography } from 'components/Atomic'

type Props = {
  firstAsset: AssetInputType
  secondAsset: AssetInputType
  poolShare: number
  firstToSecondRate: number
}

// TODO: add i18n there
export const PoolInfo = ({
  firstAsset,
  secondAsset,
  poolShare,
  firstToSecondRate,
}: Props) => {
  return (
    <Box className="self-stretch" col>
      <Box my={40}>
        <Typography>{'Prices and Pool Share'}</Typography>
      </Box>
      <Box>
        <Box
          className="flex-1 gap-4 border-0 border-light-typo-gray dark:border-dark-typo-gray border-dotted border-r"
          col
        >
          <Typography variant="caption" color="secondary">
            {firstAsset.name}
            {' per '}
            {secondAsset.name}
          </Typography>
          <Typography variant="h4">{firstToSecondRate}</Typography>
        </Box>
        <Box
          className="flex-1 gap-4 text-center border-0 border-light-typo-gray dark:border-dark-typo-gray border-dotted border-r"
          col
        >
          <Typography variant="caption" color="secondary">
            {secondAsset.name}
            {' per '}
            {firstAsset.name}
          </Typography>
          <Typography variant="h4">{1 / firstToSecondRate}</Typography>
        </Box>
        <Box className="flex-1 gap-4 text-right" col>
          <Typography variant="caption" color="secondary">
            {'Share of Pool'}
          </Typography>
          <Typography variant="h4">{`${poolShare}%`}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
