import { ReactComponent as App } from './app.svg'
import { ReactComponent as ChartCandle } from './chartCandle.svg'
import { ReactComponent as Cloud } from './cloud.svg'
import { ReactComponent as Gwei } from './gwei.svg'
import { ReactComponent as InIcon } from './inIcon.svg'
import { ReactComponent as Lightning } from './lightningThorswap.svg'
import { ReactComponent as List } from './list.svg'
import { ReactComponent as Moon } from './moon.svg'
import { ReactComponent as Refresh } from './refresh.svg'
import { ReactComponent as Settings } from './settings.svg'
import { ReactComponent as Sputnik } from './sputnik.svg'
import { ReactComponent as Sun } from './sun.svg'
import { CustomIconProps, SvgIcon } from './SvgIcon'
import { ReactComponent as Swap } from './swap.svg'
import { ReactComponent as ThreeDots } from './threedots.svg'
import { ReactComponent as TradeLightning } from './tradeLightning.svg'
import { ReactComponent as Wallet } from './wallet.svg'
import { ReactComponent as Watch } from './watch.svg'

export type SvgIconName = keyof typeof Svgs

export const Svgs = {
  lightning: Lightning,
  chartCandle: ChartCandle,
  app: App,
  list: List,
  tradeLightning: TradeLightning,
  swap: Swap,
  inIcon: InIcon,
  sputnik: Sputnik,
  watch: Watch,
  wallet: Wallet,
  cloud: Cloud,
  settings: Settings,
  threedots: ThreeDots,
  gwei: Gwei,
  sun: Sun,
  moon: Moon,
  refresh: Refresh,
}

export const SvgIcons = {
  chartCandle: (props: CustomIconProps) => (
    <SvgIcon name="chartCandle" {...props} />
  ),
  lightning: (props: CustomIconProps) => (
    <SvgIcon name="lightning" {...props} />
  ),

  app: (props: CustomIconProps) => <SvgIcon name={'app'} {...props} />,
  list: (props: CustomIconProps) => <SvgIcon name={'list'} {...props} />,
  tradeLightning: (props: CustomIconProps) => (
    <SvgIcon name="tradeLightning" {...props} />
  ),
  swap: (props: CustomIconProps) => <SvgIcon name="swap" {...props} />,
  inIcon: (props: CustomIconProps) => <SvgIcon name="inIcon" {...props} />,
  sputnik: (props: CustomIconProps) => <SvgIcon name="sputnik" {...props} />,
  watch: (props: CustomIconProps) => <SvgIcon name="watch" {...props} />,
  wallet: (props: CustomIconProps) => <SvgIcon name="wallet" {...props} />,
  cloud: (props: CustomIconProps) => <SvgIcon name="cloud" {...props} />,
  settings: (props: CustomIconProps) => <SvgIcon name="settings" {...props} />,
  threedots: (props: CustomIconProps) => (
    <SvgIcon name="threedots" {...props} />
  ),
  gwei: (props: CustomIconProps) => <SvgIcon name="gwei" {...props} />,
  sun: (props: CustomIconProps) => <SvgIcon name="sun" {...props} />,
  moon: (props: CustomIconProps) => <SvgIcon name="moon" {...props} />,
  refresh: (props: CustomIconProps) => <SvgIcon name="refresh" {...props} />,
} as const
