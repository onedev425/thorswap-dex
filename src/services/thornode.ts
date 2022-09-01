import type { InboundAddressesItem } from '@thorswap-lib/midgard-sdk';
import axios, { AxiosResponse } from 'axios';
import { IS_TESTNET, MIDGARD_URL } from 'settings/config';
import { LiquidityProvider } from 'store/midgard/types';

export const THORNODE_URI = `${
  import.meta.env.VITE_MAINNET_THORNODE || 'https://thornode.thorswap.net'
}/thorchain`;

const THORNODE_API_URI = IS_TESTNET
  ? 'https://testnet.thornode.thorswap.net/thorchain'
  : THORNODE_URI;

export const midgardAPI = (url: string) => {
  return `${MIDGARD_URL}/v2/${url}`;
};

// https://docs.thorchain.org/how-it-works/governance#mimir

export const getThorchainMimir = () => {
  return axios.get(midgardAPI('thorchain/mimir'));
};

export const getInboundData = (): Promise<AxiosResponse<InboundAddressesItem[]>> => {
  return axios.get(midgardAPI('thorchain/inbound_addresses'));
};

export const getLiquidityProvider = ({
  asset,
  address,
}: {
  asset: string;
  address: string;
}): Promise<AxiosResponse<LiquidityProvider>> => {
  return axios.get(`${THORNODE_API_URI}/pool/${asset}/liquidity_provider/${address}`);
};
