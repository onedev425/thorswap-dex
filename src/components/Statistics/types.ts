import { ReactNode } from 'react'

export type StatisticsType = {
  amount: number
  change: number
  className?: string
  percentage?: boolean
  title: string | ReactNode
  value: number
}
