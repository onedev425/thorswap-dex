import { RequestClient } from "@swapkit/sdk";
import dayjs from "dayjs";
import { THORNODE_URL } from "settings/config";

import type { InboundAddressesItem, SaverProvider, ThornodePoolType } from "./types";

const getThornameExpireDayjs = ({
  expire,
  lastThorchainBlock = 0,
}: {
  expire: string;
  lastThorchainBlock: number;
}) => {
  const blocksPerYear = 5_256_000;
  const blocksDiff = lastThorchainBlock - Number.parseInt(expire);
  const days = (blocksDiff / blocksPerYear) * -365;

  return dayjs().add(days, "days");
};

export const getThornameExpireDate = ({
  expire,
  lastThorchainBlock = 0,
}: {
  expire: string;
  lastThorchainBlock: number;
}) => {
  return getThornameExpireDayjs({ expire, lastThorchainBlock }).format("YYYY-MM-DD");
};

export const isThornameExpired = ({
  expire,
  lastThorchainBlock = 0,
}: {
  expire: string;
  lastThorchainBlock: number;
}) => {
  return getThornameExpireDayjs({ expire, lastThorchainBlock }).isBefore(dayjs());
};

export const getInboundData = () =>
  RequestClient.get<InboundAddressesItem[]>(`${THORNODE_URL}/inbound_addresses`);

export const getSaverData = ({ asset, address }: { asset: string; address: string }) =>
  RequestClient.get<SaverProvider>(`${THORNODE_URL}/pool/${asset}/saver/${address}`);

export const getSaverQuote = ({
  type,
  ...rest
}: {
  type: "deposit" | "withdraw";
  asset: string;
  amount?: string;
  address?: string;
  withdraw_bps?: string;
}) =>
  RequestClient.get(`${THORNODE_URL}/quote/saver/${type}?${new URLSearchParams(rest).toString()}`);

export const getSaverPools = () => RequestClient.get<ThornodePoolType[]>(`${THORNODE_URL}/pools`);
