import { Asset } from '@thorswap-lib/multichain-sdk';
import { IconColor } from 'components/Atomic';
import { ColorType } from 'types/app';

export type AssetTickerType =
  | 'ABCD'
  | 'AERGO'
  | 'ALA'
  | 'ANKR'
  | 'ARN'
  | 'ARPA'
  | 'ART'
  | 'ATP'
  | 'AVA'
  | 'AVAX'
  | 'AWC'
  | 'AXPR'
  | 'BAW'
  | 'BCH'
  | 'BCPT'
  | 'BEAR'
  | 'BET'
  | 'BETX'
  | 'BGBP'
  | 'BHC'
  | 'BHFT'
  | 'BIDR'
  | 'BKBT'
  | 'BKRW'
  | 'BLINK'
  | 'BOLT'
  | 'BST2'
  | 'BTC'
  | 'BTCB'
  | 'BTTB'
  | 'BULL'
  | 'BUSD'
  | 'BZNT'
  | 'CAN'
  | 'CAS'
  | 'CBIX'
  | 'CBM'
  | 'CHZ'
  | 'CNNS'
  | 'COS'
  | 'COTI'
  | 'COVA'
  | 'CRPT'
  | 'CSM'
  | 'DARC'
  | 'DEEP'
  | 'DEFI'
  | 'DOS'
  | 'DREP'
  | 'DUSK'
  | 'EBST'
  | 'ECO'
  | 'EET'
  | 'ENTRP'
  | 'EOS'
  | 'EOSBEAR'
  | 'EOSBULL'
  | 'EQL'
  | 'ERD'
  | 'ETH'
  | 'ETHBEAR'
  | 'ETHBULL'
  | 'EVT'
  | 'FRM'
  | 'FSN'
  | 'FTM'
  | 'GIV'
  | 'GMAT'
  | 'GTEX'
  | 'GTO'
  | 'HNST'
  | 'HYN'
  | 'IDRTB'
  | 'IRIS'
  | 'JDXU'
  | 'KAT'
  | 'KAVA'
  | 'LBA'
  | 'LIT'
  | 'LOKI'
  | 'LTC'
  | 'LTO'
  | 'LYFE'
  | 'MATIC'
  | 'MCASH'
  | 'MDAB'
  | 'MEDB'
  | 'MEETONE'
  | 'MITH'
  | 'MITX'
  | 'MTV'
  | 'MTXLT'
  | 'MVL'
  | 'MZK'
  | 'NEW'
  | 'NEXO'
  | 'NODE'
  | 'NOIZB'
  | 'NOW'
  | 'NPXB'
  | 'NPXSXEM'
  | 'ONE'
  | 'ONT'
  | 'OWTX'
  | 'PCAT'
  | 'PHB'
  | 'PHV'
  | 'PIBNB'
  | 'PLG'
  | 'PVT'
  | 'PYN'
  | 'QBX'
  | 'RAVEN'
  | 'RNO'
  | 'RUNE'
  | 'SBC'
  | 'SHR'
  | 'SLV'
  | 'SOL'
  | 'SPNDB'
  | 'STYL'
  | 'SWINGBY'
  | 'SWIPE'
  | 'SXP'
  | 'TAUDB'
  | 'TCADB'
  | 'TGBPB'
  | 'THKDB'
  | 'TM2'
  | 'TOMOB'
  | 'TOP'
  | 'TROY'
  | 'TRUE'
  | 'TRXB'
  | 'TUSDB'
  | 'TWT'
  | 'UGAS'
  | 'UND'
  | 'UPX'
  | 'USDH'
  | 'USDC'
  | 'USDT'
  | 'USDSB'
  | 'VDX'
  | 'VIDT'
  | 'VNDC'
  | 'VOTE'
  | 'VRAB'
  | 'WICC'
  | 'WINB'
  | 'WISH'
  | 'WRX'
  | 'XBASE'
  | 'XNS'
  | 'XRP'
  | 'XRPBEAR'
  | 'XRPBULL'
  | 'XTZ'
  | 'ZEBI'
  | 'DOGE'
  | 'BNB'
  | 'RUNE'
  | 'DAI'
  | 'TGT'
  | 'ALCX'
  | 'XRUNE'
  | 'WETH'
  | 'THOR'
  | 'VTHOR'
  | 'ATOM';

export const iconSizes = {
  large: 72,
  big: 56,
  normal: 40,
  small: 32,
  tiny: 24,
};

export type IconSize = keyof typeof iconSizes;

type AssetStyleType = {
  color?: IconColor;
  size?: IconSize | number;
  className?: string;
};

export type AssetIconProps = (
  | { asset: Asset; logoURI?: string }
  | { logoURI: string; asset?: Asset }
) & {
  badge?: string;
  hasChainIcon?: boolean;
  secondaryIconPlacement?: SecondaryIconPlacement;
  hasShadow?: boolean;
  bgColor?: ColorType;
  shadowPosition?: 'corner' | 'center';
} & AssetStyleType;

export type AssetLpIconProps = {
  asset1: Asset;
  asset2: Asset;
  inline?: boolean;
  hasShadow?: boolean;
} & AssetStyleType;

export type SecondaryIconPlacement = 'tl' | 'tr' | 'bl' | 'br';
