import { MouseEventHandler } from 'react'

import { SvgIconName, Svgs } from './svgIconList'

export type CustomIconProps = {
  size?: number
  className?: string
  onClick?: (() => void) | MouseEventHandler
}

type SvgIconProps = {
  name: SvgIconName
} & CustomIconProps

export const SvgIcon = ({ size, name, className, onClick }: SvgIconProps) => {
  const IconComp = Svgs[name]

  return (
    <IconComp
      className={className}
      width={size}
      height={size}
      onClick={onClick}
    />
  )
}
