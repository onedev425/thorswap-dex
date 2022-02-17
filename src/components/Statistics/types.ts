import React from 'react'

export type StatisticsType = {
  amount: number
  change: number
  className?: string
  percentage?: boolean
  title: string | React.ReactNode
  value: number
}
