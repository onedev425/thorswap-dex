import { Typography } from 'components/Atomic';
import { memo } from 'react';

type Props = {
  label: string;
  hasError?: boolean;
};

export const FieldLabel = memo(({ label, hasError }: Props) => {
  return (
    <Typography className="mx-2 mb-0.5" color={hasError ? 'red' : 'primary'} variant="caption">
      {label}
    </Typography>
  );
});
