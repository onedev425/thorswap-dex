import { STATIC_API } from 'settings/config';
import { Token } from 'store/thorswap/types';

const providersMap = {
  coingecko: 'coinGecko',
  oneinch: '1inch',
  zerox: '1inch',
  zapper: 'zapper',
};

const providersInfoMap = {
  // AVAX
  pangolin: 'AVAX.PNG-0x60781C2586D68229fde47564546784ab3fACA982',
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

export const tokenLogoURL = ({
  provider,
  address,
  identifier,
}: Pick<Token, 'provider' | 'address' | 'identifier'>): string => {
  const tokensProvider = providersMap[provider.toLowerCase() as 'oneinch'] || 'coinGecko';

  return `${STATIC_API}/token-list/assets/${tokensProvider}/${identifier.toLowerCase()}-${address.toLowerCase()}.png`;
};

export const providerLogoURL = (provider: string) => {
  const parsedProvider = (provider || '').replaceAll('_', '').toLowerCase() as 'thorchain';

  const providerData = providersInfoMap[parsedProvider];

  if (!providerData) {
    return '';
  }

  const [identifier, address] = providerData.split('-');
  return tokenLogoURL({ address, identifier, provider: 'coinGecko' });
};
