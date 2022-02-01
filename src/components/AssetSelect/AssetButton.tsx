import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { AssetTickerType } from 'components/AssetIcon/types'
import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { Typography } from 'components/Typography'

type Props = {
  className?: string
  size?: 'small' | 'large'
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
      className={classNames(className, 'pl-1 pr-4 justify-between')}
      size={size}
      bgColor="tertiary"
      transform="uppercase"
      onClick={onClick}
      startIcon={
        <AssetIcon
          name={name}
          className="mr-3"
          size={size === 'small' ? 32 : 40}
        />
      }
      endIcon={
        withChevron ? (
          <Icon className="ml-4" name="chevronDown" color="secondary" />
        ) : null
      }
    >
      <Typography variant="h4" fontWeight="normal" transform="uppercase">
        {name}
      </Typography>
    </Button>
  )
}
