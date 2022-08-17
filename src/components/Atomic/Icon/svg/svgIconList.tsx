// Chain Icons
import { ReactComponent as Avalanche } from 'assets/images/svg/avalanche.svg'
import { ReactComponent as BitcoinCash } from 'assets/images/svg/bch.svg'
import { ReactComponent as Bitcoin } from 'assets/images/svg/bitcoin.svg'
import { ReactComponent as Bnb } from 'assets/images/svg/bnb.svg'
import { ReactComponent as Cosmos } from 'assets/images/svg/cosmos.svg'
import { ReactComponent as Dogecoin } from 'assets/images/svg/dogecoin.svg'
import { ReactComponent as Ethereum } from 'assets/images/svg/ethereum.svg'
import { ReactComponent as Litecoin } from 'assets/images/svg/litecoin.svg'
import { ReactComponent as Solana } from 'assets/images/svg/solana.svg'
import { ReactComponent as Thorchain } from 'assets/images/svg/thorchain.svg'

import { ReactComponent as App } from './app.svg'
import { ReactComponent as Binance3d } from './binance.svg'
import { ReactComponent as Bitcoin3d } from './bitcoin.svg'
import { ReactComponent as Bulb } from './bulb.svg'
import { ReactComponent as ChartCandle } from './chartCandle.svg'
import { ReactComponent as Cloud } from './cloud.svg'
import { ReactComponent as Collapse } from './collapse.svg'
import { ReactComponent as Comma } from './comma.svg'
import { ReactComponent as Ethereum3d } from './ethereum.svg'
import { ReactComponent as EtherScan } from './etherscan.svg'
import { ReactComponent as EtherScanLight } from './etherscanLight.svg'
import { ReactComponent as Fees } from './fees.svg'
import { ReactComponent as Brazil } from './flags/brazil.svg'
import { ReactComponent as Cambodia } from './flags/cambodia.svg'
import { ReactComponent as China } from './flags/china.svg'
import { ReactComponent as France } from './flags/france.svg'
import { ReactComponent as Germany } from './flags/germany.svg'
import { ReactComponent as India } from './flags/india.svg'
import { ReactComponent as Italy } from './flags/italy.svg'
import { ReactComponent as Korea } from './flags/korea.svg'
import { ReactComponent as Netherlands } from './flags/netherlands.svg'
import { ReactComponent as Pakistan } from './flags/pakistan.svg'
import { ReactComponent as Poland } from './flags/poland.svg'
import { ReactComponent as Portugal } from './flags/portugal.svg'
import { ReactComponent as Russia } from './flags/russia.svg'
import { ReactComponent as Saudi } from './flags/saudi.svg'
import Spain from './flags/spain.png'
import { ReactComponent as USA } from './flags/usa.svg'
import { ReactComponent as Gwei } from './gwei.svg'
import { ReactComponent as Import } from './import.svg'
import { ReactComponent as InIcon } from './inIcon.svg'
import { ReactComponent as Keplr } from './keplr.svg'
import { ReactComponent as Keystore } from './keystore.svg'
import { ReactComponent as Ledger } from './ledger.svg'
import { ReactComponent as Lightning } from './lightningThorswap.svg'
import { ReactComponent as Metamask } from './metamask.svg'
import { ReactComponent as Moon } from './moon.svg'
import { ReactComponent as Phantom } from './phantom.svg'
import { ReactComponent as Receive } from './receive.svg'
import { ReactComponent as Router } from './router.svg'
import { ReactComponent as Send } from './send.svg'
import { ReactComponent as Settings } from './settings.svg'
import { ReactComponent as Sputnik } from './sputnik.svg'
import { ReactComponent as Squares } from './squares.svg'
import { ReactComponent as Station } from './station.svg'
import { ReactComponent as Sun } from './sun.svg'
import { CustomIconProps, SvgIcon } from './SvgIcon'
import { ReactComponent as Swap } from './swap.svg'
import { ReactComponent as Thoryield } from './thoryield.svg'
import { ReactComponent as ThoryieldColor } from './thoryieldColor.svg'
import { ReactComponent as ThreeDots } from './threedots.svg'
import { ReactComponent as Tick } from './tick.svg'
import { ReactComponent as TradeLightning } from './tradeLightning.svg'
import { ReactComponent as Upload } from './upload.svg'
import { ReactComponent as Usdt } from './usdt.svg'
import { ReactComponent as VThor } from './vthor.svg'
import { ReactComponent as Wallet } from './wallet.svg'
import { ReactComponent as WalletConnect } from './walletConnect.svg'
import { ReactComponent as Watch } from './watch.svg'
import { ReactComponent as XDefi } from './xdefi.svg'

export type SvgIconName = keyof typeof Svgs

export const Svgs = {
  // chain icons
  avax: Avalanche,
  bch: BitcoinCash,
  btc: Bitcoin,
  bnb: Bnb,
  doge: Dogecoin,
  eth: Ethereum,
  ltc: Litecoin,
  sol: Solana,
  cos: Cosmos,
  thor: Thorchain,
  thoryield: Thoryield,
  thoryieldColor: ThoryieldColor,
  vthor: VThor,
  // other icons
  app: App,
  binance: Binance3d,
  bitcoin: Bitcoin3d,
  bulb: Bulb,
  chartCandle: ChartCandle,
  cloud: Cloud,
  collapse: Collapse,
  ethereum: Ethereum3d,
  gwei: Gwei,
  import: Import,
  inIcon: InIcon,
  keplr: Keplr,
  keystore: Keystore,
  ledger: Ledger,
  lightning: Lightning,
  metamask: Metamask,
  moon: Moon,
  phantom: Phantom,
  receive: Receive,
  router: Router,
  settings: Settings,
  send: Send,
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
  comma: Comma,
  fees: Fees,
  // flags
  brazil: Brazil,
  cambodia: Cambodia,
  china: China,
  france: France,
  germany: Germany,
  india: India,
  italy: Italy,
  korea: Korea,
  netherlands: Netherlands,
  pakistan: Pakistan,
  poland: Poland,
  portugal: Portugal,
  russia: Russia,
  saudi: Saudi,
  spain: Spain,
  usa: USA,
  etherscan: EtherScan,
  etherscanLight: EtherScanLight,
}

export const SvgIcons = {
  // chain icons
  bch: (props: CustomIconProps) => <SvgIcon name="bch" {...props} />,
  btc: (props: CustomIconProps) => <SvgIcon name="btc" {...props} />,
  bnb: (props: CustomIconProps) => <SvgIcon name="bnb" {...props} />,
  doge: (props: CustomIconProps) => <SvgIcon name="doge" {...props} />,
  eth: (props: CustomIconProps) => <SvgIcon name="eth" {...props} />,
  avax: (props: CustomIconProps) => <SvgIcon name="avax" {...props} />,
  ltc: (props: CustomIconProps) => <SvgIcon name="ltc" {...props} />,
  sol: (props: CustomIconProps) => <SvgIcon name="sol" {...props} />,
  gaia: (props: CustomIconProps) => <SvgIcon name="cos" {...props} />,
  thor: (props: CustomIconProps) => <SvgIcon name="thor" {...props} />,
  thoryield: (props: CustomIconProps) => (
    <SvgIcon name="thoryield" {...props} />
  ),
  thoryieldColor: (props: CustomIconProps) => (
    <SvgIcon name="thoryieldColor" {...props} />
  ),
  // other icons
  app: (props: CustomIconProps) => <SvgIcon name="app" {...props} />,
  binance: (props: CustomIconProps) => <SvgIcon name="binance" {...props} />,
  bitcoin: (props: CustomIconProps) => <SvgIcon name="bitcoin" {...props} />,
  chartCandle: (props: CustomIconProps) => (
    <SvgIcon name="chartCandle" {...props} />
  ),
  cloud: (props: CustomIconProps) => <SvgIcon name="cloud" {...props} />,
  etherscan: (props: CustomIconProps) => (
    <SvgIcon name="etherscan" {...props} />
  ),
  etherscanLight: (props: CustomIconProps) => (
    <SvgIcon name="etherscanLight" {...props} />
  ),
  ethereum: (props: CustomIconProps) => <SvgIcon name="ethereum" {...props} />,
  gwei: (props: CustomIconProps) => <SvgIcon name="gwei" {...props} />,
  inIcon: (props: CustomIconProps) => <SvgIcon name="inIcon" {...props} />,
  keplr: (props: CustomIconProps) => <SvgIcon name="keplr" {...props} />,
  keystore: (props: CustomIconProps) => <SvgIcon name="keystore" {...props} />,
  ledger: (props: CustomIconProps) => <SvgIcon name="ledger" {...props} />,
  lightning: (props: CustomIconProps) => (
    <SvgIcon name="lightning" {...props} />
  ),
  metamask: (props: CustomIconProps) => <SvgIcon name="metamask" {...props} />,
  moon: (props: CustomIconProps) => <SvgIcon name="moon" {...props} />,
  phantom: (props: CustomIconProps) => <SvgIcon name="phantom" {...props} />,
  receive: (props: CustomIconProps) => <SvgIcon name="receive" {...props} />,
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
  vthor: (props: CustomIconProps) => <SvgIcon name="vthor" {...props} />,
  walletConnect: (props: CustomIconProps) => (
    <SvgIcon name="walletConnect" {...props} />
  ),
  watch: (props: CustomIconProps) => <SvgIcon name="watch" {...props} />,
  comma: (props: CustomIconProps) => <SvgIcon name="comma" {...props} />,
  xdefi: (props: CustomIconProps) => <SvgIcon name="xdefi" {...props} />,
  bulb: (props: CustomIconProps) => <SvgIcon name="bulb" {...props} />,
  tick: (props: CustomIconProps) => <SvgIcon name="tick" {...props} />,
  router: (props: CustomIconProps) => <SvgIcon name="router" {...props} />,
  collapse: (props: CustomIconProps) => <SvgIcon name="collapse" {...props} />,
  fees: (props: CustomIconProps) => <SvgIcon name="fees" {...props} />,
  // flags
  brazil: (props: CustomIconProps) => <SvgIcon name="brazil" {...props} />,
  cambodia: (props: CustomIconProps) => <SvgIcon name="cambodia" {...props} />,
  china: (props: CustomIconProps) => <SvgIcon name="china" {...props} />,
  france: (props: CustomIconProps) => <SvgIcon name="france" {...props} />,
  germany: (props: CustomIconProps) => <SvgIcon name="germany" {...props} />,
  india: (props: CustomIconProps) => <SvgIcon name="india" {...props} />,
  italy: (props: CustomIconProps) => <SvgIcon name="italy" {...props} />,
  korea: (props: CustomIconProps) => <SvgIcon name="korea" {...props} />,
  netherlands: (props: CustomIconProps) => (
    <SvgIcon name="netherlands" {...props} />
  ),
  pakistan: (props: CustomIconProps) => <SvgIcon name="pakistan" {...props} />,
  poland: (props: CustomIconProps) => <SvgIcon name="poland" {...props} />,
  portugal: (props: CustomIconProps) => <SvgIcon name="portugal" {...props} />,
  russia: (props: CustomIconProps) => <SvgIcon name="russia" {...props} />,
  saudi: (props: CustomIconProps) => <SvgIcon name="saudi" {...props} />,
  spain: ({ size, ...rest }: CustomIconProps) => (
    <img src={Spain} style={{ width: size, height: size }} {...rest} />
  ),
  usa: (props: CustomIconProps) => <SvgIcon name="usa" {...props} />,
} as const
