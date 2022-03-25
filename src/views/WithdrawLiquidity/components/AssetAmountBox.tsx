import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Box, Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'

import { PoolAsset } from '../types'

type Props = {
  className?: string
  asset: PoolAsset
  amount: string
  stretch?: boolean
}

export const AssetAmountBox = ({
  className,
  asset,
  amount,
  stretch,
}: Props) => {
  return (
    <Box
      className={classNames(
        'p-1 rounded-full flex-1 w-full self-stretch',
        { 'max-w-[150px]': !stretch },
        genericBgClasses.secondary,
        className,
      )}
      alignCenter
    >
      <AssetIcon asset={asset.asset} />
      <Box col ml={12}>
        <Typography>{amount || '-'}</Typography>
        <Typography fontWeight="normal" color="secondary">
          {asset.asset.symbol}
        </Typography>
      </Box>
    </Box>
  )
}
