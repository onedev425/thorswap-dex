import { DetailedHTMLProps, InputHTMLAttributes, useRef } from 'react'

import classNames from 'classnames'

import { Icon, IconName, Typography } from 'components/Atomic'

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  border?: 'bottom' | 'rounded'
  icon?: IconName
  stretch?: boolean
  prefix?: string
  suffix?: string
}

const DEFAULT_ICON_SIZE = 16

export const Input = ({
  border,
  className,
  icon,
  onChange,
  placeholder,
  prefix,
  suffix,
  stretch,
  value,
  ...restProps
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={classNames(
        'flex flex-row py-3 transition-colors',
        'border-light-border-primary focus-within:border-dark-typo-gray dark:border-dark-border-primary hover:border-dark-typo-gray dark:hover:border-dark-typo-gray focus-within::hover:border-dark-typo-gray',
        { 'border-none': !border },
        {
          'border-b border-t border-x border-solid rounded-2xl':
            border === 'rounded',
        },
        { 'border-b border-t-0 border-x-0 border-solid': border === 'bottom' },
        stretch ? 'w-full' : 'w-fit',
      )}
    >
      {prefix}
      {icon && (
        <Icon
          className={classNames('pr-4', {
            'pl-3': border === 'rounded',
          })}
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
          { 'w-48': icon && !stretch, 'px-4': !icon },
          className,
        )}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...restProps}
      />
      {suffix && (
        <Typography variant="caption-xs" color="secondary">
          {suffix}
        </Typography>
      )}
    </div>
  )
}
