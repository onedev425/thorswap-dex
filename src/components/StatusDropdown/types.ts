import { StatusType } from 'hooks/useNetwork'

import { colorClasses } from '../Atomic/Icon/Icon'

export type StatusItem = {
  label: string
  value?: string
  statusType?: StatusType
}

export const statusColorOptions: Record<StatusType, keyof typeof colorClasses> =
  {
    [StatusType.Normal]: 'green',
    [StatusType.Warning]: 'yellow',
    [StatusType.Error]: 'red',
  }
