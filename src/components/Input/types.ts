import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react'

import { IconName } from 'components/Atomic'

export type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  border?: 'bottom' | 'rounded'
  icon?: IconName
  prefix?: string
  stretch?: boolean
  suffix?: string | ReactNode
  symbol?: string | ReactNode
  containerClassName?: string
}
