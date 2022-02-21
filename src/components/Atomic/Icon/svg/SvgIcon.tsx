import { SvgIconName, Svgs } from './svgIconList'

export type CustomIconProps = {
  size?: number
  className?: string
  onClick?: () => void
}

type SvgIconProps = {
  name: SvgIconName
} & CustomIconProps

export const SvgIcon = (props: SvgIconProps) => {
  const { size, name, className, onClick } = props
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
