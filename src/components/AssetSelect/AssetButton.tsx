import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Button, Box, Typography, Icon } from 'components/Atomic'

type Props = {
  className?: string
  size?: 'sm' | 'md'
  onClick?: () => void
  asset: Asset
  withChevron?: boolean
}

export function AssetButton({
  className,
  asset,
  size,
  withChevron,
  onClick,
}: Props) {
  return (
    <Button
      className={classNames(
        className,
        '!pl-1 !rounded-full justify-between gap-1',
        size === 'sm' ? '!h-10' : '!h-12',
        withChevron
          ? 'min-w-[120px] md:min-w-[160px]'
          : 'min-w-[90px] md:min-w-[110px] ',
      )}
      size={size}
      variant="tint"
      transform="uppercase"
      onClick={onClick}
      startIcon={<AssetIcon asset={asset} size={size === 'sm' ? 28 : 40} />}
      endIcon={
        withChevron ? (
          <Box center className="min-w-[20px]">
            <Icon name="chevronDown" color="secondary" />
          </Box>
        ) : null
      }
    >
      <Typography variant="h5" fontWeight="medium" transform="uppercase">
        {asset.symbol}
      </Typography>
    </Button>
  )
}
