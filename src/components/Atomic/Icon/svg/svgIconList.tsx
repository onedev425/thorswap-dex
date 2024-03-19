// Chain Icons
import Avalanche from 'assets/images/svg/avalanche.svg?react';
import BitcoinCash from 'assets/images/svg/bch.svg?react';
import Bitcoin from 'assets/images/svg/bitcoin.svg?react';
import Bnb from 'assets/images/svg/bnb.svg?react';
import Cosmos from 'assets/images/svg/cosmos.svg?react';
import Dogecoin from 'assets/images/svg/dogecoin.svg?react';
import Ethereum from 'assets/images/svg/ethereum.svg?react';
import Litecoin from 'assets/images/svg/litecoin.svg?react';
import Thorchain from 'assets/images/svg/thorchain.svg?react';
import type { FunctionComponent, MouseEventHandler, SVGProps } from 'react';

import App from './app.svg?react';
import Binance3d from './binance.svg?react';
import Bitcoin3d from './bitcoin.svg?react';
import Brave from './brave.png';
import BscScan from './bscscan.svg?react';
import BscScanLight from './bscscanLight.svg?react';
import Bulb from './bulb.svg?react';
import ChartCandle from './chartCandle.svg?react';
import Cloud from './cloud.svg?react';
import CoinbaseWallet from './coinbaseWallet.svg?react';
import Collapse from './collapse.svg?react';
import Comma from './comma.svg?react';
import Ethereum3d from './ethereum.svg?react';
import EtherScan from './etherscan.svg?react';
import EtherScanLight from './etherscanLight.svg?react';
import Fees from './fees.svg?react';
import Brazil from './flags/brazil.svg?react';
import Cambodia from './flags/cambodia.svg?react';
import China from './flags/china.svg?react';
import France from './flags/france.svg?react';
import Germany from './flags/germany.svg?react';
import India from './flags/india.svg?react';
import Italy from './flags/italy.svg?react';
import Japan from './flags/japan.svg?react';
import Korea from './flags/korea.svg?react';
import Netherlands from './flags/netherlands.svg?react';
import Pakistan from './flags/pakistan.svg?react';
import Poland from './flags/poland.svg?react';
import Portugal from './flags/portugal.svg?react';
import Russia from './flags/russia.svg?react';
import Saudi from './flags/saudi.svg?react';
import Spain from './flags/spain.png';
import USA from './flags/usa.svg?react';
import Gwei from './gwei.svg?react';
import InIcon from './inIcon.svg?react';
import Keepkey from './keepkey.svg?react';
import Keplr from './keplr.svg?react';
import Keystore from './keystore.svg?react';
import Ledger from './ledger.svg?react';
import Lightning from './lightningThorswap.svg?react';
import Metamask from './metamask.svg?react';
import Moon from './moon.svg?react';
import Okx from './Okx.svg?react';
import Rainbow from './rainbow.svg?react';
import Receive from './receive.svg?react';
import Router from './router.svg?react';
import Settings from './settings.svg?react';
import Snowtrace from './snowtrace.svg?react';
import Sputnik from './sputnik.svg?react';
import Squares from './squares.svg?react';
import Station from './station.svg?react';
import Sun from './sun.svg?react';
import Swap from './swap.svg?react';
import Thoryield from './thoryield.svg?react';
import ThoryieldColor from './thoryieldColor.svg?react';
import ThreeDots from './threedots.svg?react';
import Tick from './tick.svg?react';
import TradeLightning from './tradeLightning.svg?react';
import Trezor from './trezor.svg?react';
import TrustWallet from './trustWallet.svg?react';
import TrustWalletWhite from './trustWalletWhite.svg?react';
import Upload from './upload.svg?react';
import Usdt from './usdt.svg?react';
import VThor from './vthor.svg?react';
import WalletConnect from './walletConnect.svg?react';
import Watch from './watch.svg?react';
import XDefi from './xdefi.svg?react';
import XLogo from './xLogo.svg?react';
import XLogoLight from './xLogoLight.svg?react';

export type SvgIconName = keyof typeof Svgs;

export const Svgs = {
  // chain icons
  avax: Avalanche,
  bch: BitcoinCash,
  bscscan: BscScan,
  bscscanLight: BscScanLight,
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
  keepkey: Keepkey,
  keplr: Keplr,
  keystore: Keystore,
  ledger: Ledger,
  lightning: Lightning,
  metamask: Metamask,
  moon: Moon,
  okx: Okx,
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
  trezor: Trezor,
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
  rainbow: Rainbow,
  snowtrace: Snowtrace,
  trustWallet: TrustWallet,
  coinbaseWallet: CoinbaseWallet,
  trustWalletWhite: TrustWalletWhite,
  usa: USA,

  xLogo: XLogo,
  xLogoLight: XLogoLight,

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
  ({ size, ...rest }: CustomIconProps) => (
    <img src={src} style={{ width: size, height: size }} {...rest} />
  );

IconComponents.brave = ImageIcon(Brave);
IconComponents.spain = ImageIcon(Spain);

export const SvgIcons = IconComponents;
