import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box } from 'components/Atomic';
import { StatusType } from 'hooks/useNetwork';
import { memo } from 'react';

export type Props = {
  className?: string;
  status: StatusType;
  withLabel?: boolean;
};

const colors: Record<StatusType, string> = {
  [StatusType.Good]: 'bg-green',
  [StatusType.Slow]: 'bg-yellow',
  [StatusType.Busy]: 'bg-red',
};

export const StatusBadge = memo(({ className, status, withLabel }: Props) => {
  return (
    <>
      <Box
        className={classNames(
          'w-[14px] h-[14px] border-none rounded-full',
          colors[status],
          className,
        )}
      />
      {withLabel && <Text className="pl-2">{status}</Text>}
    </>
  );
});
