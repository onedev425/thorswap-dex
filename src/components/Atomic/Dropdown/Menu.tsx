import { Listbox } from '@headlessui/react';
import classNames from 'classnames';
import { genericBgClasses } from 'components/constants';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{ className?: string }>;

export const Menu = ({ className, children }: Props) => {
  return (
    <Listbox.Options
      as="div"
      className={classNames(
        'z-10 absolute left-0 origin-top-right mt-1 rounded-2xl overflow-hidden focus:outline-none shadow-2xl min-w-full',
        'border border-solid border-light-border-primary dark:border-dark-border-primary',
        genericBgClasses.primary,
        className,
      )}
    >
      {children}
    </Listbox.Options>
  );
};
