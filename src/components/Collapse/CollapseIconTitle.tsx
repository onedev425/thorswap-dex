import { Icon } from 'components/Icon'
import { Typography } from 'components/Typography'

import { CollapseTitleProps } from './types'

export const CollapseIconTitle = ({
  iconName,
  title,
  subTitle,
}: CollapseTitleProps) => {
  return (
    <div className="flex flex-row gap-x-2 items-center">
      <Icon name={iconName} color="secondary" />
      <Typography variant="subtitle1" color="primary" fontWeight="normal">
        {title}
      </Typography>
      <Typography variant="subtitle1" color="secondary" fontWeight="normal">
        {`(${subTitle})`}
      </Typography>
    </div>
  )
}
