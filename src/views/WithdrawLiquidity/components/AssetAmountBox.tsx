import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Box, Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'

import { PoolAsset } from '../types'

type Props = {
  asset: PoolAsset
  amount: string
}

export const AssetAmountBox = ({ asset, amount }: Props) => {
  return (
    <Box
      className={classNames(
        'p-1 rounded-full flex-1 max-w-[150px] w-full self-stretch',
        genericBgClasses.secondary,
      )}
      alignCenter
    >
      <AssetIcon asset={asset.asset} />
      <Box col ml={12}>
        <Typography>{amount || '-'}</Typography>
        <Typography fontWeight="normal" color="secondary">
          {asset.asset}
        </Typography>
      </Box>
    </Box>
  )
}
