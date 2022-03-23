export type InfoRowSize = 'sm' | 'md' | 'lg'

export type InfoRowConfig = {
  label: string
  value: string | React.ReactNode
}

export type InfoRowType = {
  showBorder?: boolean
  size?: InfoRowSize
} & InfoRowConfig

export type InfoRowProps = {
  className?: string
} & InfoRowType
