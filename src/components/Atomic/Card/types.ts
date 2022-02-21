export type CardSize = 'md' | 'lg'

export type CardProps = {
  className?: string
  shadow?: boolean
  size?: CardSize
  stretch?: boolean
  children?: React.ReactNode
  onClick?: () => void
}
