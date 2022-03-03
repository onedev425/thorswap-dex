import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Button, Typography, Icon } from 'components/Atomic'

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
  size = 'md',
  withChevron,
  onClick,
}: Props) {
  return (
    <Button
      className={classNames(
        className,
        'pl-1 pr-2 !rounded-full !h-10 !hover:bg-light-gray-primary border !border-solid !border-opacity-40 dark:border-dark-gray-primary dark:!hover:bg-dark-gray-primary',
      )}
      size={size}
      variant="tint"
      transform="uppercase"
      startIcon={<AssetIcon asset={asset} size={28} />}
      endIcon={withChevron ? <Icon name="chevronDown" color="primary" /> : null}
      onClick={onClick}
    >
      <Typography fontWeight="medium" variant="subtitle2" transform="uppercase">
        {asset.symbol}
      </Typography>
    </Button>
  )
}
