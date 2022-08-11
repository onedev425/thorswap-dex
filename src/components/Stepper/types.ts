import { ReactNode } from 'react'

export type StepType = {
  id: number
  label: string
  content: ReactNode
  tooltip?: string
}
