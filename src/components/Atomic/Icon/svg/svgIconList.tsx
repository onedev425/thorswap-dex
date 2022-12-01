// Chain Icons
import { ReactComponent as Avalanche } from 'assets/images/svg/avalanche.svg';
import { ReactComponent as BitcoinCash } from 'assets/images/svg/bch.svg';
import { ReactComponent as Bitcoin } from 'assets/images/svg/bitcoin.svg';
import { ReactComponent as Bnb } from 'assets/images/svg/bnb.svg';
import { ReactComponent as Cosmos } from 'assets/images/svg/cosmos.svg';
import { ReactComponent as Dogecoin } from 'assets/images/svg/dogecoin.svg';
import { ReactComponent as Ethereum } from 'assets/images/svg/ethereum.svg';
import { ReactComponent as Litecoin } from 'assets/images/svg/litecoin.svg';
import { ReactComponent as Thorchain } from 'assets/images/svg/thorchain.svg';
import { FunctionComponent, MouseEventHandler, SVGProps } from 'react';

import { ReactComponent as App } from './app.svg';
import { ReactComponent as Binance3d } from './binance.svg';
import { ReactComponent as Bitcoin3d } from './bitcoin.svg';
import Brave from './brave.png';
import { ReactComponent as Bulb } from './bulb.svg';
import { ReactComponent as ChartCandle } from './chartCandle.svg';
import { ReactComponent as Cloud } from './cloud.svg';
import { ReactComponent as Collapse } from './collapse.svg';
import { ReactComponent as Comma } from './comma.svg';
import { ReactComponent as Ethereum3d } from './ethereum.svg';
import { ReactComponent as EtherScan } from './etherscan.svg';
import { ReactComponent as EtherScanLight } from './etherscanLight.svg';
import { ReactComponent as Fees } from './fees.svg';
import { ReactComponent as Brazil } from './flags/brazil.svg';
import { ReactComponent as Cambodia } from './flags/cambodia.svg';
import { ReactComponent as China } from './flags/china.svg';
import { ReactComponent as France } from './flags/france.svg';
import { ReactComponent as Germany } from './flags/germany.svg';
import { ReactComponent as India } from './flags/india.svg';
import { ReactComponent as Italy } from './flags/italy.svg';
import { ReactComponent as Japan } from './flags/japan.svg';
import { ReactComponent as Korea } from './flags/korea.svg';
import { ReactComponent as Netherlands } from './flags/netherlands.svg';
import { ReactComponent as Pakistan } from './flags/pakistan.svg';
import { ReactComponent as Poland } from './flags/poland.svg';
import { ReactComponent as Portugal } from './flags/portugal.svg';
import { ReactComponent as Russia } from './flags/russia.svg';
import { ReactComponent as Saudi } from './flags/saudi.svg';
import Spain from './flags/spain.png';
import { ReactComponent as USA } from './flags/usa.svg';
import { ReactComponent as Gwei } from './gwei.svg';
import { ReactComponent as InIcon } from './inIcon.svg';
import { ReactComponent as Keplr } from './keplr.svg';
import { ReactComponent as Keystore } from './keystore.svg';
import { ReactComponent as Ledger } from './ledger.svg';
import { ReactComponent as Lightning } from './lightningThorswap.svg';
import { ReactComponent as Metamask } from './metamask.svg';
import { ReactComponent as Moon } from './moon.svg';
import { ReactComponent as Receive } from './receive.svg';
import { ReactComponent as Router } from './router.svg';
import { ReactComponent as Settings } from './settings.svg';
import { ReactComponent as Snowtrace } from './snowtrace.svg';
import { ReactComponent as Sputnik } from './sputnik.svg';
import { ReactComponent as Squares } from './squares.svg';
import { ReactComponent as Station } from './station.svg';
import { ReactComponent as Sun } from './sun.svg';
import { ReactComponent as Swap } from './swap.svg';
import { ReactComponent as Thoryield } from './thoryield.svg';
import { ReactComponent as ThoryieldColor } from './thoryieldColor.svg';
import { ReactComponent as ThreeDots } from './threedots.svg';
import { ReactComponent as Tick } from './tick.svg';
import { ReactComponent as TradeLightning } from './tradeLightning.svg';
import { ReactComponent as TrustWallet } from './trustWallet.svg';
import { ReactComponent as TrustWalletWhite } from './trustWalletWhite.svg';
import { ReactComponent as Upload } from './upload.svg';
import { ReactComponent as Usdt } from './usdt.svg';
import { ReactComponent as VThor } from './vthor.svg';
import { ReactComponent as WalletConnect } from './walletConnect.svg';
import { ReactComponent as Watch } from './watch.svg';
import { ReactComponent as XDefi } from './xdefi.svg';

export type SvgIconName = keyof typeof Svgs;

export const Svgs = {
  // chain icons
  avax: Avalanche,
  bch: BitcoinCash,
  btc: Bitcoin,
  bnb: Bnb,
  doge: Dogecoin,
  eth: Ethereum,
  ltc: Litecoin,
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
  inIcon: InIcon,
  keplr: Keplr,
  keystore: Keystore,
  ledger: Ledger,
  lightning: Lightning,
  metamask: Metamask,
  moon: Moon,
  receive: Receive,
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
  walletConnect: WalletConnect,
  watch: Watch,
  xdefi: XDefi,
  comma: Comma,
  fees: Fees,
  // flags
  brazil: Brazil,
  cambodia: Cambodia,
  china: China,
  etherscan: EtherScan,
  etherscanLight: EtherScanLight,
  france: France,
  germany: Germany,
  india: India,
  italy: Italy,
  japan: Japan,
  korea: Korea,
  netherlands: Netherlands,
  pakistan: Pakistan,
  poland: Poland,
  portugal: Portugal,
  russia: Russia,
  saudi: Saudi,
  snowtrace: Snowtrace,
  trustWallet: TrustWallet,
  trustWalletWhite: TrustWalletWhite,
  usa: USA,

  // png only for typings
  spain: Spain,
  brave: Brave,
};

const Icons = Object.entries(Svgs);

type CustomIconProps = {
  size?: number;
  className?: string;
  onClick?: (() => void) | MouseEventHandler;
};

const IconComponents = Icons.reduce(
  (acc, [name, Icon]) => {
    acc[name as SvgIconName] = (props: CustomIconProps) => <Icon {...props} />;
    return acc;
  },
  {} as {
    [name in SvgIconName]:
      | string
      | FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  },
);
const ImageIcon =
  (src: any) =>
  ({ size, ...rest }: CustomIconProps) =>
    <img src={src} style={{ width: size, height: size }} {...rest} />;

IconComponents.brave = ImageIcon(Brave);
IconComponents.spain = ImageIcon(Spain);

export const SvgIcons = IconComponents;
