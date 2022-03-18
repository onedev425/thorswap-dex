import { DetailedHTMLProps, InputHTMLAttributes, useRef } from 'react'

import classNames from 'classnames'

import { Box, Icon, IconName, Typography } from 'components/Atomic'

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  border?: 'bottom' | 'rounded'
  icon?: IconName
  prefix?: string
  stretch?: boolean
  suffix?: string
  symbol?: string
  containerClassName?: string
}

const DEFAULT_ICON_SIZE = 16

export const Input = ({
  border,
  className,
  containerClassName,
  disabled,
  icon,
  onChange,
  placeholder,
  prefix,
  stretch,
  suffix,
  symbol,
  value,
  ...restProps
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Box
      className={classNames(
        'flex flex-row py-3 transition-colors',
        'border-dark-typo-gray focus-within:border-dark-typo-gray dark:border-dark-border-primary hover:border-dark-typo-gray dark:hover:border-dark-typo-gray focus-within::hover:border-dark-typo-gray',
        {
          'border-none': !border,
          'border-solid': border,
          'px-2 border rounded-2xl': border === 'rounded',
          'border-0 border-b': border === 'bottom',
        },
        stretch ? 'w-full' : 'w-fit',
        containerClassName,
      )}
      onClick={() => inputRef.current?.focus()}
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
        disabled={disabled}
        ref={inputRef}
        className={classNames(
          'bg-transparent border-none dark:placeholder-dark-typo-gray dark:text-dark-typo-primary font-bold font-primary placeholder-light-typo-gray text-light-typo-primary text-xs focus:outline-none',
          stretch ? 'w-full' : 'w-52',
          { 'w-48': icon && !stretch, 'cursor-not-allowed': disabled },
          className,
        )}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...restProps}
      />

      {symbol && (
        <Typography variant="caption-xs" className="pr-2">
          {symbol}
        </Typography>
      )}
      {suffix && (
        <Typography variant="caption-xs" color="secondary">
          {suffix}
        </Typography>
      )}
    </Box>
  )
}
