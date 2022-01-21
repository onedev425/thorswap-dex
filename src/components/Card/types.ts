export type CardSize = 'md' | 'lg'

export type CardProps = {
  className?: string
  size?: CardSize
  stretch?: boolean
  children?: React.ReactNode
}
