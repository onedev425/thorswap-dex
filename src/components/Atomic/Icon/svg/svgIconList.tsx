import { ReactComponent as App } from './app.svg'
import { ReactComponent as Bulb } from './bulb.svg'
import { ReactComponent as ChartCandle } from './chartCandle.svg'
import { ReactComponent as Cloud } from './cloud.svg'
import { ReactComponent as Gwei } from './gwei.svg'
import { ReactComponent as Import } from './import.svg'
import { ReactComponent as InIcon } from './inIcon.svg'
import { ReactComponent as Keystore } from './keystore.svg'
import { ReactComponent as Ledger } from './ledger.svg'
import { ReactComponent as Lightning } from './lightningThorswap.svg'
import { ReactComponent as List } from './list.svg'
import { ReactComponent as Metamask } from './metamask.svg'
import { ReactComponent as Moon } from './moon.svg'
import { ReactComponent as Onboard } from './onboard.svg'
import { ReactComponent as PlusCircle } from './plus.svg'
import { ReactComponent as Refresh } from './refresh.svg'
import { ReactComponent as Router } from './router.svg'
import { ReactComponent as Settings } from './settings.svg'
import { ReactComponent as Sputnik } from './sputnik.svg'
import { ReactComponent as Squares } from './squares.svg'
import { ReactComponent as Station } from './station.svg'
import { ReactComponent as Sun } from './sun.svg'
import { CustomIconProps, SvgIcon } from './SvgIcon'
import { ReactComponent as Swap } from './swap.svg'
import { ReactComponent as ThreeDots } from './threedots.svg'
import { ReactComponent as Tick } from './tick.svg'
import { ReactComponent as TradeLightning } from './tradeLightning.svg'
import { ReactComponent as Upload } from './upload.svg'
import { ReactComponent as Usdt } from './usdt.svg'
import { ReactComponent as Wallet } from './wallet.svg'
import { ReactComponent as WalletConnect } from './walletConnect.svg'
import { ReactComponent as Watch } from './watch.svg'
import { ReactComponent as XDefi } from './xdefi.svg'

export type SvgIconName = keyof typeof Svgs

export const Svgs = {
  app: App,
  bulb: Bulb,
  chartCandle: ChartCandle,
  cloud: Cloud,
  gwei: Gwei,
  import: Import,
  inIcon: InIcon,
  keystore: Keystore,
  ledger: Ledger,
  lightning: Lightning,
  list: List,
  metamask: Metamask,
  moon: Moon,
  onboard: Onboard,
  plusCircle: PlusCircle,
  refresh: Refresh,
  router: Router,
  settings: Settings,
  sputnik: Sputnik,
  squares: Squares,
  station: Station,
  sun: Sun,
  swap: Swap,
  threedots: ThreeDots,
  tick: Tick,
  tradeLightning: TradeLightning,
  upload: Upload,
  usdt: Usdt,
  wallet: Wallet,
  walletConnect: WalletConnect,
  watch: Watch,
  xdefi: XDefi,
}

export const SvgIcons = {
  app: (props: CustomIconProps) => <SvgIcon name={'app'} {...props} />,
  chartCandle: (props: CustomIconProps) => (
    <SvgIcon name="chartCandle" {...props} />
  ),
  cloud: (props: CustomIconProps) => <SvgIcon name="cloud" {...props} />,
  gwei: (props: CustomIconProps) => <SvgIcon name="gwei" {...props} />,
  import: (props: CustomIconProps) => <SvgIcon name="import" {...props} />,
  inIcon: (props: CustomIconProps) => <SvgIcon name="inIcon" {...props} />,
  keystore: (props: CustomIconProps) => <SvgIcon name="keystore" {...props} />,
  ledger: (props: CustomIconProps) => <SvgIcon name="ledger" {...props} />,
  lightning: (props: CustomIconProps) => (
    <SvgIcon name="lightning" {...props} />
  ),
  list: (props: CustomIconProps) => <SvgIcon name={'list'} {...props} />,
  metamask: (props: CustomIconProps) => <SvgIcon name="metamask" {...props} />,
  moon: (props: CustomIconProps) => <SvgIcon name="moon" {...props} />,
  onboard: (props: CustomIconProps) => <SvgIcon name="onboard" {...props} />,
  plusCircle: (props: CustomIconProps) => (
    <SvgIcon name="plusCircle" {...props} />
  ),
  refresh: (props: CustomIconProps) => <SvgIcon name="refresh" {...props} />,
  settings: (props: CustomIconProps) => <SvgIcon name="settings" {...props} />,
  sputnik: (props: CustomIconProps) => <SvgIcon name="sputnik" {...props} />,
  station: (props: CustomIconProps) => <SvgIcon name="station" {...props} />,
  sun: (props: CustomIconProps) => <SvgIcon name="sun" {...props} />,
  squares: (props: CustomIconProps) => <SvgIcon name="squares" {...props} />,
  swap: (props: CustomIconProps) => <SvgIcon name="swap" {...props} />,
  threedots: (props: CustomIconProps) => (
    <SvgIcon name="threedots" {...props} />
  ),
  tradeLightning: (props: CustomIconProps) => (
    <SvgIcon name="tradeLightning" {...props} />
  ),
  upload: (props: CustomIconProps) => <SvgIcon name="upload" {...props} />,
  usdt: (props: CustomIconProps) => <SvgIcon name="usdt" {...props} />,
  walletConnect: (props: CustomIconProps) => (
    <SvgIcon name="walletConnect" {...props} />
  ),
  watch: (props: CustomIconProps) => <SvgIcon name="watch" {...props} />,
  xdefi: (props: CustomIconProps) => <SvgIcon name="xdefi" {...props} />,
  bulb: (props: CustomIconProps) => <SvgIcon name="bulb" {...props} />,
  tick: (props: CustomIconProps) => <SvgIcon name="tick" {...props} />,
  router: (props: CustomIconProps) => <SvgIcon name="router" {...props} />,
} as const
