import { getRequest } from '@thorswap-lib/helpers';
import type { InboundAddressesItem } from '@thorswap-lib/midgard-sdk';
import dayjs from 'dayjs';
import { THORNODE_URL } from 'settings/config';

import type { SaverProvider, ThornodePoolType } from './types';

export const getThornameExpireDate = ({
  expire,
  lastThorchainBlock = 0,
}: {
  expire: string;
  lastThorchainBlock: number;
}) => {
  const blocksPerYear = 5_256_000;
  const blocksDiff = lastThorchainBlock - parseInt(expire);
  const days = (blocksDiff / blocksPerYear) * -365;

  return dayjs().add(days, 'days').format('YYYY-MM-DD');
};

export const getInboundData = () =>
  getRequest<InboundAddressesItem[]>(`${THORNODE_URL}/inbound_addresses`);

export const getSaverData = ({ asset, address }: { asset: string; address: string }) =>
  getRequest<SaverProvider>(`${THORNODE_URL}/pool/${asset}/saver/${address}`);

export const getSaverQuote = ({
  type,
  ...rest
}: {
  type: 'deposit' | 'withdraw';
  asset: string;
  amount?: string;
  address?: string;
  withdraw_bps?: string;
}) => getRequest(`${THORNODE_URL}/quote/saver/${type}?${new URLSearchParams(rest).toString()}`);

export const getSaverPools = () => getRequest<ThornodePoolType[]>(`${THORNODE_URL}/pools`);
