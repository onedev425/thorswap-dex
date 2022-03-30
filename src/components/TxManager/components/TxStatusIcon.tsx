import { Icon } from 'components/Atomic'
import { TxProgressStatus } from 'components/TxManager/types'

type Props = {
  size?: number
  status?: TxProgressStatus
}

export const TxStatusIcon = ({ status, size = 24 }: Props) => {
  if (status === 'success')
    return <Icon name="checkmark" size={size} color="secondaryBtn" />

  if (status === 'failed') {
    return <Icon name="xCircle" size={size} color="pink" />
  }

  if (status === 'refunded') {
    return <Icon name="revert" size={size} color="yellow" />
  }

  return <Icon name="loader" spin size={size} color="primaryBtn" />
}
