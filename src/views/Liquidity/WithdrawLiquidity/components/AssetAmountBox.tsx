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
      className={classNames('rounded-full', genericBgClasses.secondary)}
      p={12}
      width={160}
      alignCenter
    >
      <AssetIcon name={asset.name} />
      <Box col ml={12}>
        <Typography>{amount || '-'}</Typography>
        <Typography fontWeight="normal" color="secondary">
          {asset.name}
        </Typography>
      </Box>
    </Box>
  )
}
