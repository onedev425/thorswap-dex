import { Switch } from '@chakra-ui/react';
import { memo } from 'react';

type SwitchToggleProps = {
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  checked: boolean;
  variant?: string;
};

export const SwitchToggle = memo(
  ({ checked = false, disabled = false, onChange, variant }: SwitchToggleProps) => {
    return (
      <Switch
        disabled={disabled}
        isChecked={checked}
        onChange={(e) => onChange(e.target.checked)}
        size="lg"
        variant={variant}
      />
    );
  },
);
