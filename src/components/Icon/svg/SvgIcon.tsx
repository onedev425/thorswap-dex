import React from 'react'

export type CustomIconProps = {
  size?: number
  className?: string
  onClick?: () => void
}

type SvgIconProps = {
  svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
} & CustomIconProps

export const SvgIcon = (props: SvgIconProps) => {
  const { size, svg: IconComp, className, onClick } = props

  return (
    <IconComp
      className={className}
      width={size}
      height={size}
      onClick={onClick}
    />
  )
}
