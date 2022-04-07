import { ReactNode } from 'react'

export type InfoRowSize = 'sm' | 'md' | 'lg'

export type InfoRowConfig = {
  label: string | ReactNode
  value: string | ReactNode
  size?: InfoRowSize
}

export type InfoRowType = {
  showBorder?: boolean
  size?: InfoRowSize
} & InfoRowConfig

export type InfoRowProps = {
  className?: string
} & InfoRowType
