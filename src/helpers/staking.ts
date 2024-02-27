import { RequestClient } from '@swapkit/core';
import { getBlockRewards } from 'services/contract';
import { logException } from 'services/logger';

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
 * 1 block every 12 seconds
 */
export const BLOCKS_PER_YEAR = 7200 * 365;
const periodInDays = 30;
const BUYBACK_PCT = 0.75;

/**
 * daily $THOR affiliateEarned -> take last periodInDays days -> sum -> avg -> multiply by 52 weeks
 */
const getEstimatedYearlyThorBuyback = (data: FlipSideData[]) => {
  const dataFromPeriod = data.slice(-periodInDays);
  const fees = dataFromPeriod.reduce(
    (prev, current) => ({
      AFF_FEE_EARNED_THOR: prev.AFF_FEE_EARNED_THOR + current.AFF_FEE_EARNED_THOR,
      AFF_FEE_EARNED_USD: prev.AFF_FEE_EARNED_USD + current.AFF_FEE_EARNED_USD,
    }),
    { AFF_FEE_EARNED_THOR: 0, AFF_FEE_EARNED_USD: 0 },
  );

  const feesAfterBuyback = {
    AFF_FEE_EARNED_THOR: fees.AFF_FEE_EARNED_THOR * BUYBACK_PCT,
    AFF_FEE_EARNED_USD: fees.AFF_FEE_EARNED_USD * BUYBACK_PCT,
  };

  return (feesAfterBuyback.AFF_FEE_EARNED_THOR / periodInDays) * 365;
};

const getThorBuybackYear = async () => {
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
    logException(error as Error);
    return 0;
  }
};

export const fetchVthorStats = async (tvl: number) => {
  const blockRewards = await getBlockRewards();
  const thorBlockRewardsYear = blockRewards * BLOCKS_PER_YEAR;
  const buybackThorYear = await getThorBuybackYear().catch(() => 0);

  return {
    apy: ((thorBlockRewardsYear + buybackThorYear) / tvl) * 100,
    realYieldApy: (thorBlockRewardsYear / tvl) * 100,
    emissionsApy: (buybackThorYear / tvl) * 100,
  };
};
