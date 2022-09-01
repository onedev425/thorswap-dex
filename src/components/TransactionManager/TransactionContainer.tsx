import classNames from 'classnames';
import { Box } from 'components/Atomic';
import { memo, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{ className?: string }>;

export const TransactionContainer = memo(({ children, className }: Props) => {
  return (
    <Box
      alignCenter
      row
      className={classNames(
        'first:!mt-0 mt-1 px-2 py-1.5 dark:bg-dark-border-primary rounded-md border border-solid border-transparent transition',
        className,
      )}
    >
      {children}
    </Box>
  );
});
