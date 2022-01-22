import classNames from 'classnames'

import { Typography } from 'components/Typography'

import { ColorType } from 'types/global'

import { Props, bgClasses, borderClasses } from './types'

const getBgClassNames = (
  bgColor: ColorType,
  outline: boolean,
  borderless: boolean,
) => {
  if (borderless) return 'border-none bg-transparent dark:bg-transparent'

  if (outline) return bgClasses[bgColor][0]

  return bgClasses[bgColor][1]
}

export const Button = (props: Props) => {
  const {
    className = '',
    bgColor = 'primary',
    textColor = 'primary',
    size = 'small',
    outline = false,
    borderless = false,
    disabled = false,
    startIcon,
    endIcon,
    children,
    ...rest
  } = props

  const bgClassNames = getBgClassNames(bgColor, outline, borderless)

  return (
    <button
      className={classNames(
        borderClasses[bgColor],
        disabled
          ? 'cursor-not-allowed bg-opacity-30 border-opacity-30'
          : 'cursor-pointer',
        borderless ? '' : 'border',
        bgClassNames,
        outline && disabled ? 'hover:bg-opacity-0' : '',
        size === 'small' ? 'h-10' : 'h-12 min-w-[180px]',
        size === 'small' ? 'rounded-2xl' : 'rounded-3xl',
        'flex items-center justify-center px-4 border-solid font-primary outline-none transition',
        className,
      )}
      {...rest}
    >
      {startIcon && startIcon}
      <Typography
        className={classNames(startIcon ? 'ml-1' : '', endIcon ? 'mr-1' : '')}
        variant="caption"
        transform={size === 'large' ? 'uppercase' : 'capitalize'}
        color={textColor}
      >
        {children}
      </Typography>
      {endIcon && endIcon}
    </button>
  )
}
