import { DetailedHTMLProps, InputHTMLAttributes } from 'react'

import { IconName } from 'components/Atomic'

export type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  border?: 'bottom' | 'rounded'
  icon?: IconName
  prefix?: string
  stretch?: boolean
  suffix?: string
  symbol?: string
  containerClassName?: string
}
