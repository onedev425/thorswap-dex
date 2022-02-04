import { DetailedHTMLProps, InputHTMLAttributes, useRef } from 'react'

import classNames from 'classnames'

import { Icon, IconName } from 'components/Icon'

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  borderless?: boolean
  icon?: IconName
  stretch?: boolean
}

const DEFAULT_ICON_SIZE = 16

export const Input = ({
  borderless = false,
  className,
  icon,
  onChange,
  placeholder,
  stretch,
  value,
  ...restProps
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={classNames(
        'flex flex-row py-2 transition-colors',
        'border-light-border-primary focus-within:border-dark-typo-gray dark:border-dark-border-primary hover:border-dark-typo-gray dark:hover:border-dark-typo-gray focus-within::hover:border-dark-typo-gray',
        { 'border-b border-t-0 border-x-0 border-solid': !borderless },
        stretch ? 'w-full' : 'w-fit',
      )}
    >
      {icon && (
        <Icon
          className="pr-4"
          color="tertiary"
          size={DEFAULT_ICON_SIZE}
          name={icon}
        />
      )}

      <input
        ref={inputRef}
        className={classNames(
          'bg-transparent border-none dark:placeholder-dark-typo-gray dark:text-dark-typo-primary font-bold font-primary placeholder-light-typo-gray text-light-typo-primary text-xs focus:outline-none',
          stretch ? 'w-full' : 'w-52',
          { 'w-44': icon && !stretch },
          className,
        )}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...restProps}
      />
    </div>
  )
}
