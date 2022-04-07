import { IconName } from 'components/Atomic'

import { ColorType } from 'types/app'

export enum Position {
  TopLeft = 'top-left',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
}

export const borderClasses: Record<Position, string> = {
  [Position.TopLeft]: 'rounded-tl-none',
  [Position.TopRight]: 'rounded-tr-none',
  [Position.BottomLeft]: 'rounded-bl-none',
  [Position.BottomRight]: 'rounded-br-none',
}

export const borderPositions = [
  Position.BottomRight,
  Position.BottomLeft,
  Position.TopRight,
  Position.TopLeft,
]

export type LeafProps = {
  label: string
  value: number | string
  bnPosition: Position // border-none position
}

export type StatsGroupProps = {
  title: string
  stats: FixedLengthArray<{ label: string; value: number | string }, 4>
  iconName: IconName
  iconColor: ColorType
}
