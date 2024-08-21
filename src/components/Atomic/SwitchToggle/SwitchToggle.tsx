import { Switch } from "@chakra-ui/react";
import { memo } from "react";

type SwitchToggleProps = {
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  checked: boolean;
  variant?: string;
  size?: "sm" | "md" | "lg";
};

export const SwitchToggle = memo(
  ({ checked = false, disabled = false, size = "lg", onChange, variant }: SwitchToggleProps) => {
    return (
      <Switch
        disabled={disabled}
        isChecked={checked}
        onChange={(e) => onChange(e.target.checked)}
        size={size}
        variant={variant}
      />
    );
  },
);
