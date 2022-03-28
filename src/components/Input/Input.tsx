import { useRef, forwardRef, RefObject } from 'react'

import classNames from 'classnames'

import { Box, Icon, Typography } from 'components/Atomic'
import { InputProps } from 'components/Input/types'

const DEFAULT_ICON_SIZE = 16

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
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
    }: InputProps,
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const focus = () => {
      const inputInstanceRef = (ref as RefObject<HTMLInputElement>) || inputRef
      inputInstanceRef?.current?.focus?.()
    }

    return (
      <div>
        <Box
          className={classNames(
            'flex flex-row py-1.5 transition-colors',
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
          onClick={focus}
          alignCenter
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
            ref={ref || inputRef}
            className={classNames(
              'bg-transparent border-none dark:placeholder-dark-typo-gray dark:text-dark-typo-primary font-bold text-base placeholder-light-typo-gray text-light-typo-primary focus:outline-none',
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
          {suffix &&
            (typeof suffix === 'string' ? (
              <Typography variant="caption-xs" color="secondary">
                {suffix}
              </Typography>
            ) : (
              suffix
            ))}
        </Box>

        {error && (
          <Typography
            fontWeight="semibold"
            className="pl-2 pt-2"
            variant="caption"
            color="red"
          >
            {error}
          </Typography>
        )}
      </div>
    )
  },
)
