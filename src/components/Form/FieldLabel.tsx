import { Text } from '@chakra-ui/react';
import { memo } from 'react';

type Props = {
  label: string;
  hasError?: boolean;
};

export const FieldLabel = memo(({ label, hasError }: Props) => {
  return (
    <Text className="mx-2 mb-0.5" textStyle="caption" variant={hasError ? 'red' : 'primary'}>
      {label}
    </Text>
  );
});
