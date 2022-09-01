import { Icon } from 'components/Atomic';
import { TxProgressStatus } from 'components/TxManager/types';

type Props = {
  size?: number;
  status?: TxProgressStatus;
};

export const TxStatusIcon = ({ status, size = 24 }: Props) => {
  if (status === 'success') return <Icon color="secondaryBtn" name="checkmark" size={size} />;

  if (status === 'failed') {
    return <Icon color="pink" name="xCircle" size={size} />;
  }

  if (status === 'refunded') {
    return <Icon color="yellow" name="revert" size={size} />;
  }

  return <Icon spin color="primaryBtn" name="loader" size={size} />;
};
