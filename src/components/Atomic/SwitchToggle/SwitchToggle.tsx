import { Switch } from '@chakra-ui/react';
import classNames from 'classnames';
import { memo } from 'react';

type SwitchToggleProps = {
  className?: string;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  checked: boolean;
};

export const SwitchToggle = memo(
  ({ className = '', checked = false, disabled = false, onChange }: SwitchToggleProps) => {
    return (
      <Switch
        className={classNames(
          'inline-flex relative h-6 border-0 rounded-full w-12 transition-colors cursor-pointer',
          checked
            ? 'bg-btn-light-tint-active dark:bg-dark-bg-secondary'
            : 'bg-light-gray-light dark:bg-dark-gray-primary',
          { 'grayscale opacity-50': disabled },
          className,
        )}
        disabled={disabled}
        isChecked={checked}
        onChange={(e) => onChange(e.target.checked)}
      >
        <span
          className={classNames(
            'w-5 h-5 absolute left-[6px] top-[2px] transform rounded-full transition ease-in-out duration-200',
            checked ? 'translate-x-5 bg-cyan' : 'translate-x-[-4px] bg-white',
          )}
        />
      </Switch>
    );
  },
);
