import classNames from 'classnames'

import { StatusType } from 'hooks/useNetwork'

export type Props = {
  className?: string
  status: StatusType
}

const colors: Record<StatusType, string> = {
  [StatusType.Error]: 'bg-red',
  [StatusType.Warning]: 'bg-yellow',
  [StatusType.Normal]: 'bg-green',
}

export const StatusBadge = (props: Props) => {
  const { className, status } = props

  return (
    <div
      className={classNames(
        'w-[14px] h-[14px] border-none rounded-full',
        colors[status],
        className,
      )}
    />
  )
}
