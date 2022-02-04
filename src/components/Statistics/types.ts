import React from 'react'

export type StatisticsType = {
  amount: number
  change: number
  percentage?: boolean
  title: string | React.ReactNode
  value: number
}
