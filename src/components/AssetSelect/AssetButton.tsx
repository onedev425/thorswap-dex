import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Button, Typography, Icon, Box } from 'components/Atomic'

type Props = {
  className?: string
  size?: 'sm' | 'md'
  onClick?: () => void
  asset: Asset
  withChevron?: boolean
  showAssetType?: boolean
}

export function AssetButton({
  className,
  asset,
  size = 'md',
  withChevron,
  showAssetType,
  onClick,
}: Props) {
  return (
    <Button
      className={classNames(
        className,
        'pl-1 pr-2 !rounded-full !h-10 !hover:bg-light-gray-primary border !border-solid !border-opacity-40 border-dark-gray-primary !hover:bg-dark-gray-primary',
        { 'pr-4': !withChevron },
      )}
      size={size}
      variant="tint"
      transform="uppercase"
      startIcon={<AssetIcon asset={asset} size={28} />}
      endIcon={withChevron ? <Icon name="chevronDown" color="primary" /> : null}
      onClick={onClick}
    >
      <Box className="text-left" col>
        <Typography
          className="!leading-5"
          fontWeight="medium"
          variant="subtitle2"
          transform="uppercase"
        >
          {asset.ticker}
        </Typography>
        {showAssetType && (
          <Typography
            className="!leading-4"
            transform="uppercase"
            variant="caption-xs"
            fontWeight="normal"
            color={asset.isSynth ? 'primaryBtn' : 'secondary'}
          >
            {asset.type}
          </Typography>
        )}
      </Box>
    </Button>
  )
}
