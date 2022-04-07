import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react'

import { IconName } from 'components/Atomic'

export type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  error?: string
  border?: 'bottom' | 'rounded'
  icon?: IconName
  stretch?: boolean
  customPrefix?: string | ReactNode
  suffix?: string | ReactNode
  symbol?: string | ReactNode
  containerClassName?: string
}
