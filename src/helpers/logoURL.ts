import { Chain } from '@thorswap-lib/types';
import { bepIconMapping } from 'helpers/assets';
import { STATIC_API } from 'settings/config';

export const getCustomIconImageUrl = (
  name: 'avax' | 'bnb' | 'atom' | 'dogecoin' | 'rune' | 'sol' | 'thor' | 'vthor',
  type: 'png' | 'svg' = 'svg',
) => new URL(`../assets/images/svg/asset-${name}.${type}`, import.meta.url).href;

const twBaseUri = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains';

const providersInfoMap = {
  // AVAX
  pangolin: 'AVAX.PNG-0x60781C2586D68229fde47564546784ab3fACA982',
  traderjoe: 'AVAX.JOE-0X6E84A6216EA6DACC71EE8E6B0A5B7322EEBC0FDD',
  platypus: 'AVAX.AVAX',
  kyberswapv2: 'ETH.KNC-0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202',
  kyber: 'ETH.KNC-0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202',
  // ETH
  thorchain: 'ETH.RUNE-0x3155ba85d5f96b2d030a4966af206230e46849cb',
  uniswapv2: 'ETH.UNI-0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  uniswapv3: 'ETH.UNI-0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  zerox: 'ETH.ZRX-0xe41d2489571d322189246dafa5ebde1f4699f498',
  oneinch: 'ETH.1INCH-0x111111111117dc0aa78b770fa6a738034120c302',
  sushiswap: 'ETH.SUSHI-0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  sushi: 'ETH.SUSHI-0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  balancerv2: 'ETH.BAL-0xba100000625a3754423978a60c9317c58a424e3d',
  curvev2: 'ETH.CRV-0xd533a949740bb3306d119cc777fa900ba034cd52',
  dodo: 'ETH.DODO-0x43dfc4159d86f3a37a5a4b3d4580b888ad7d4ddd',
  pmm1: '',
  pmm3: '',
  pmm4: '',
  psm: '',
};

const customIconMap = () => ({
  ATOM: getCustomIconImageUrl('atom'),
  AVAX: getCustomIconImageUrl('avax'),
  BNB: getCustomIconImageUrl('bnb'),
  DOGE: getCustomIconImageUrl('dogecoin', 'png'),
  RUNE: getCustomIconImageUrl('rune'),
  VTHOR: getCustomIconImageUrl('vthor', 'png'),
  THOR: getCustomIconImageUrl('thor', 'png'),
});

export const tokenLogoURL = ({
  address,
  identifier,
}: {
  address?: string;
  identifier: string;
}): string => {
  const [chain, ...possibleTicker] = identifier.split('-')?.[0]?.split('.') || [];
  const ticker = possibleTicker.join('.');

  const logoSymbol = bepIconMapping[ticker as 'RUNE'] || ticker;
  const customIcon = customIconMap()[ticker as 'RUNE'];

  if (customIcon) return customIcon;

  return Chain.Binance !== (chain as Chain) &&
    address &&
    address.toLocaleLowerCase() !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    ? `${STATIC_API}/token-list/images/${identifier.toLowerCase()}-${address.toLowerCase()}.png`
    : `${twBaseUri}/binance/assets/${logoSymbol}/logo.png`;
};

export const providerLogoURL = (provider: string) => {
  const parsedProvider = (provider || '').replaceAll('_', '').toLowerCase() as 'thorchain';

  const providerData = providersInfoMap[parsedProvider];

  if (!providerData) return '';

  const [identifier, address] = providerData.split('-');
  return tokenLogoURL({ address, identifier });
};
