import { MouseEvent, useRef } from 'react'

import classNames from 'classnames'

import { Typography } from 'components/Atomic'

import { ButtonProps } from './types'
import { useButtonClasses } from './useButtonClasses'

export const Button = ({
  children,
  className = '',
  disabled = false,
  endIcon,
  size = 'md',
  startIcon,
  textColor,
  transform = 'capitalize',
  type = 'default',
  variant = 'primary',
  onClick,
  ...rest
}: ButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const {
    backgroundActiveClass,
    backgroundClass,
    buttonClass,
    outlinedClass,
    typographyOutlineClass,
    typographyVariant,
  } = useButtonClasses({ size, variant })

  const isOutlined = type === 'outline'
  const isBorderless = type === 'borderless'

  // It helps to remove focus state from button focus styles be applied only on `tab` select
  const handleClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    onClick?.(event)
    buttonRef.current?.blur()
  }

  return (
    <div className="group">
      <button
        {...rest}
        ref={buttonRef}
        onClick={handleClick}
        disabled={disabled}
        className={classNames(
          'flex flex-1 border-2 items-center justify-center outline-none p-0 duration-[160ms] disabled:opacity-75',
          buttonClass,
          className,
          isBorderless || isOutlined
            ? 'bg-transparent active:bg-transparent'
            : backgroundClass,
          {
            [outlinedClass]: isOutlined,
            'cursor-not-allowed': disabled,
            'border-transparent': isBorderless || !isOutlined,
            [`cursor-pointer ${backgroundActiveClass}`]: !(
              disabled ||
              isBorderless ||
              isOutlined
            ),
          },
        )}
      >
        {startIcon && startIcon}
        {children && (
          <Typography
            className={classNames('text-white duration-[160ms]', {
              [typographyOutlineClass]: ['outline', 'borderless'].includes(
                type,
              ),
            })}
            variant={typographyVariant}
            transform={transform}
            color={textColor}
          >
            {children}
          </Typography>
        )}
        {endIcon && endIcon}
      </button>
    </div>
  )
}
