import { memo } from 'react'

import classNames from 'classnames'

import { StatusType } from 'hooks/useNetwork'

export type Props = {
  className?: string
  status: StatusType
}

const colors: Record<StatusType, string> = {
  [StatusType.Error]: 'bg-red',
  [StatusType.Normal]: 'bg-green',
  [StatusType.Warning]: 'bg-yellow',
}

export const StatusBadge = memo(({ className, status }: Props) => {
  return (
    <div
      className={classNames(
        'w-[14px] h-[14px] border-none rounded-full',
        colors[status],
        className,
      )}
    />
  )
})
