import { ColorType, FixedLengthArray } from '../../types/global'
import { IconName } from '../Icon'

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
  borderNonePosition: Position
}

export type StatsGroupProps = {
  stats: FixedLengthArray<{ label: string; value: number | string }, 4>
  iconName: IconName
  iconColor: ColorType
}
