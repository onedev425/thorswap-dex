import { ReactNode } from 'react'

export type HighlightCardProps = {
  className?: string
  children: ReactNode
  isFocused?: boolean
  onClick?: () => void
}
