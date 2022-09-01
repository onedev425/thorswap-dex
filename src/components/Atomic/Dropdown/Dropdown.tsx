import { Listbox } from '@headlessui/react';
import classNames from 'classnames';
import { DropdownOptions } from 'components/Atomic/Dropdown/types';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<DropdownOptions>;

export const Dropdown = ({ className, children, disabled, value, onChange }: Props) => {
  return (
    <Listbox
      as="div"
      className={classNames('z-10 relative text-left inline-block w-full', className)}
      disabled={disabled}
      onChange={onChange}
      value={value}
    >
      {children}
    </Listbox>
  );
};
