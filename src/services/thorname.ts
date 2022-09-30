import dayjs from 'dayjs';
import { midgardApi } from 'services/midgard';

export const getThornameDetails = (name: string) => {
  return midgardApi.getTHORNameDetail(name);
};

export const getAddressThornames = (address: string) => {
  return midgardApi.getTHORNamesOwnerByAddress(address);
};

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
