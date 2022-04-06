export type InfoRowSize = 'sm' | 'md' | 'lg'

export type InfoRowConfig = {
  label: string | React.ReactNode
  value: string | React.ReactNode
  size?: InfoRowSize
}

export type InfoRowType = {
  showBorder?: boolean
  size?: InfoRowSize
} & InfoRowConfig

export type InfoRowProps = {
  className?: string
} & InfoRowType
