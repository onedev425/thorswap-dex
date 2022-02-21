import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { AssetTickerType } from 'components/AssetIcon/types'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { Typography } from 'components/Typography'

type Props = {
  className?: string
  size?: 'sm' | 'md'
  onClick?: () => void
  name: AssetTickerType
  withChevron?: boolean
}

export function AssetButton({
  className,
  name,
  size,
  withChevron,
  onClick,
}: Props) {
  return (
    <Button
      className={classNames(
        className,
        'pl-1 pr-4 !rounded-lg justify-between min-w-[120px] md:min-w-[180px]',
      )}
      size={size}
      variant="tint"
      transform="uppercase"
      onClick={onClick}
      startIcon={<AssetIcon name={name} size={size === 'sm' ? 28 : 40} />}
      endIcon={
        withChevron ? (
          <Box center className="min-w-[20px]">
            <Icon name="chevronDown" color="secondary" />
          </Box>
        ) : null
      }
    >
      <Typography variant="h5" fontWeight="medium" transform="uppercase">
        {name}
      </Typography>
    </Button>
  )
}
