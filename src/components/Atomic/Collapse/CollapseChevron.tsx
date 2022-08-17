import classNames from 'classnames'

import { Icon } from 'components/Atomic/Icon'

type Props = {
  isActive: boolean
}

export const CollapseChevron = ({ isActive }: Props) => {
  return (
    <Icon
      name="chevronDown"
      color="secondary"
      className={classNames('transform duration-300 ease relative', {
        '-rotate-180': isActive,
      })}
    />
  )
}
