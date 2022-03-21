import { Switch } from '@headlessui/react'
import classNames from 'classnames'

import { SwitchToggleProps } from './types'

export const SwitchToggle = ({
  className = '',
  checked = false,
  disabled = false,
  onChange,
}: SwitchToggleProps) => {
  return (
    <Switch
      className={classNames(
        'ml-4 relative inline-flex items-center h-6 border-0 rounded-full w-12 transition-colors cursor-pointer',
        checked
          ? 'bg-light-secondary dark:bg-dark-bg-primary'
          : 'bg-light-border-primary dark:bg-dark-gray-primary',
        { 'grayscale opacity-50': disabled },
        className,
      )}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    >
      <span
        className={classNames(
          'inline-block w-5 h-5 transform rounded-full transition ease-in-out duration-200',
          checked ? 'translate-x-5 bg-cyan' : 'translate-x-[-4px] bg-white',
        )}
      />
    </Switch>
  )
}
