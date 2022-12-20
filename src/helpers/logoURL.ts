import { Chain } from '@thorswap-lib/types';
import { bepIconMapping } from 'helpers/assets';
import { STATIC_API } from 'settings/config';

export const getCustomIconImageUrl = (name: 'rune' | 'vthor', type: 'png' | 'svg') =>
  new URL(`../assets/images/svg/asset-${name}.${type}`, import.meta.url).href;

const twBaseUri = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains';

const providersInfoMap = {
  // AVAX
  pangolin: 'AVAX.PNG-0x60781C2586D68229fde47564546784ab3fACA982',
  platypus: 'AVAX.AVAX',
  traderjoe: 'AVAX.JOE-0X6E84A6216EA6DACC71EE8E6B0A5B7322EEBC0FDD',
  // ETH
  balancerv2: 'ETH.BAL-0xba100000625a3754423978a60c9317c58a424e3d',
  curve: 'ETH.CRV-0xd533a949740bb3306d119cc777fa900ba034cd52',
  curvev2: 'ETH.CRV-0xd533a949740bb3306d119cc777fa900ba034cd52',
  dodo: 'ETH.DODO-0x43dfc4159d86f3a37a5a4b3d4580b888ad7d4ddd',
  kyber: 'ETH.KNC-0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202',
  kyberswapelastic: 'ETH.KNC-0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202',
  kyberswapv2: 'ETH.KNC-0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202',
  oneinch: 'ETH.1INCH-0x111111111117dc0aa78b770fa6a738034120c302',
  saddle: 'ETH.SDL-0xf1dc500fde233a4055e25e5bbf516372bc4f6871',
  shibaswap: 'ETH.SHIB-0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
  sushi: 'ETH.SUSHI-0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  sushiswap: 'ETH.SUSHI-0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  synapse: 'ETH.SYN-0x0f2d719407fdbeff09d87557abb7232601fd9f29',
  synthetix: 'ETH.SNX-0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
  synthetixatomicsip288: 'ETH.SNX-0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
  thorchain: 'ETH.RUNE-0x3155ba85d5f96b2d030a4966af206230e46849cb',
  uniswap: 'ETH.UNI-0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  uniswapv1: 'ETH.UNI-0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  uniswapv2: 'ETH.UNI-0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  uniswapv3: 'ETH.UNI-0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  zerox: 'ETH.ZRX-0xe41d2489571d322189246dafa5ebde1f4699f498',
  defiswap: '',
  dxswap: '',
  mooniswap: '',
  mstable: '',
  xsigma: '',
  swerve: '',
  pmm1: '',
  pmm3: '',
  pmm4: '',
  psm: '',
};

export const tokenLogoURL = ({
  address,
  identifier,
}: {
  address?: string;
  identifier: string;
}): string => {
  const [chain, ...possibleTicker] = identifier.split('-')?.[0]?.split('.') || [];
  const ticker = possibleTicker.join('.');

  if (['VTHOR', 'RUNE'].includes(ticker)) {
    return getCustomIconImageUrl(
      ticker.toLowerCase() as 'vthor',
      ticker === 'VTHOR' ? 'png' : 'svg',
    );
  }
  const logoSymbol = bepIconMapping[ticker as 'TWT'] || ticker;

  return (identifier === 'BNB.BNB' || Chain.Binance !== (chain as Chain)) &&
    address?.toLocaleLowerCase() !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    ? `${STATIC_API}/token-list/images/${identifier.toLowerCase()}${
        address ? `-${address.toLowerCase()}` : ''
      }.png`
    : `${twBaseUri}/binance/assets/${logoSymbol}/logo.png`;
};

export const providerLogoURL = (provider: string) => {
  const parsedProvider = (provider || '').replaceAll('_', '').toLowerCase() as 'thorchain';

  const providerData = providersInfoMap[parsedProvider];

  if (!providerData) return '';

  const [identifier, address] = providerData.split('-');
  return tokenLogoURL({ address, identifier });
};
