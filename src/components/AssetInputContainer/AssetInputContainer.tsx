import classNames from 'classnames'

import { HighlightCard } from 'components/HighlightCard'
import { HighlightCardProps } from 'components/HighlightCard/types'

export const AssetInputContainer = ({
  className,
  ...props
}: HighlightCardProps) => {
  return (
    <HighlightCard
      className={classNames('!min-h-[107px]', className)}
      {...props}
    />
  )
}
