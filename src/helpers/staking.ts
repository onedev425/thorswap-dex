import { RequestClient } from '@swapkit/core';
import { getBlockRewards } from 'services/contract';

type FlipSideData = {
  DATE: string;
  AFF_ADDRESS: string;
  AFF_FEE_EARNED: number;
  RUNE_PRICE_USD: number;
  THOR_PRICE_USD: number;
  AFF_FEE_EARNED_USD: number;
  AFF_FEE_EARNED_THOR: number;
};

/**
 * 1 block every 6 seconds
 */
export const BLOCKS_PER_YEAR = 14400 * 365;

/**
 * daily $THOR affiliateEarned -> take last periodInDays days -> sum -> avg -> multiply by 52 weeks
 */
const getEstimatedYearlyThorBuyback = (data: FlipSideData[]) => {
  const dataFrom7Days = data.slice(-7);
  const fees = dataFrom7Days
    .map(({ AFF_FEE_EARNED_THOR }) => AFF_FEE_EARNED_THOR)
    .reduce((prev, current) => prev + current, 0);

  return (fees / 7) * 365;
};

const getThorBuyback = async () => {
  const { timestamp, cacheData } = JSON.parse(localStorage.getItem('thorBuybackData') || '{}');

  if (cacheData && Date.now() < timestamp) return getEstimatedYearlyThorBuyback(cacheData);

  try {
    const data: FlipSideData[] = await RequestClient.get(
      'https://api.flipsidecrypto.com/api/v2/queries/9daa6cd4-8e78-4432-bdd7-a5f0fc480229/data/latest',
    );

    localStorage.setItem(
      'thorBuybackData',
      JSON.stringify({ timestamp: Date.now() + 1000 * 60 * 60, cacheData: data }),
    );

    return getEstimatedYearlyThorBuyback(data);
  } catch (error: NotWorth) {
    console.error(error);
    return 0;
  }
};

export const fetchVthorApy = async (tvl: number) => {
  const blockRewards = await getBlockRewards();
  const thorBlockRewards = blockRewards * BLOCKS_PER_YEAR;
  const buybackThor = await getThorBuyback().catch(() => 0);

  return ((thorBlockRewards + buybackThor) / tvl) * 100;
};
