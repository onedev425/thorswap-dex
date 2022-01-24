import { ReactComponent as ChartCandle } from './chartCandle.svg'
import { ReactComponent as Lightning } from './lightningThorswap.svg'
import { CustomIconProps, SvgIcon } from './SvgIcon'

export type SvgIconName = keyof typeof SvgIcons

export const SvgIcons = {
  chartCandle: (props: CustomIconProps) => (
    <SvgIcon svg={ChartCandle} {...props} />
  ),
  lightning: (props: CustomIconProps) => <SvgIcon svg={Lightning} {...props} />,
} as const
