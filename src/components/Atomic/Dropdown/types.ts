import { ReactNode } from 'react'

export type DropdownMenuItem = {
  className?: string
  value: string
  disabled?: boolean
} & (
  | { label: string; Component?: undefined }
  | { label?: undefined; Component: ReactNode }
)

export type DropdownOptions = {
  className?: string
  value: string
  disabled?: boolean
  onChange: (value: string) => void
}
