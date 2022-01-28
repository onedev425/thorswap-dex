import { ReactComponent as ChartCandle } from './chartCandle.svg'
import { ReactComponent as Lightning } from './lightningThorswap.svg'
import { CustomIconProps, SvgIcon } from './SvgIcon'

export type SvgIconName = keyof typeof Svgs

export const Svgs = {
  lightning: Lightning,
  chartCandle: ChartCandle,
}

export const SvgIcons = {
  chartCandle: (props: CustomIconProps) => (
    <SvgIcon name="chartCandle" {...props} />
  ),
  lightning: (props: CustomIconProps) => (
    <SvgIcon name="lightning" {...props} />
  ),
} as const
