import { getRequest } from '@thorswap-lib/multichain-core';
import takeRight from 'lodash/takeRight';

export const BLOCKS_PER_DAY = 6432;
export const BLOCKS_PER_MONTH = BLOCKS_PER_DAY * 30;
export const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365;

export const VTHOR_BLOCK_REWARD = 15;

// const THOR_PRICE = 1.5
// const THOR_REWARDS_PER_BLOCK = 20

// APR = (dailyBlockRewards / totalAmount) * 365
export const getAPR = (blockReward: number, totalAmount: number) => {
  if (totalAmount === 0) return Number.MAX_SAFE_INTEGER;

  return ((blockReward * BLOCKS_PER_YEAR) / totalAmount) * 100;
};

// APY = (daily ROI + 1) ^ 365
export const getAPY = (blockReward: number, totalAmount: number) => {
  if (totalAmount === 0) return Number.MAX_SAFE_INTEGER;

  const dailyROI = (blockReward * BLOCKS_PER_DAY) / totalAmount;

  return ((1 + dailyROI) ** 365 - 1) * 100;
};

export const apr2apy = (apr: number) => {
  return ((1 + apr / 100 / 365) ** 365 - 1) * 100;
};

export const apr2blockReward = (apr: number, totalAmount: number) => {
  return (apr * totalAmount) / 100 / BLOCKS_PER_YEAR;
};

function calculateMovingAverage(data: number[], window: number) {
  const last7days = data.length >= window ? takeRight(data, window) : data;

  const accThorBuyback = last7days.reduce((prev, current) => prev + current, 0);

  return accThorBuyback;
}

export const getThorBuyback = async () => {
  try {
    const data = await getRequest<
      [{ DATE: string; AFF_ADDRESS: string; AFF_FEE_EARNED_THOR: number }]
    >(
      'https://api.flipsidecrypto.com/api/v2/queries/9daa6cd4-8e78-4432-bdd7-a5f0fc480229/data/latest',
    );

    const affiliateFeesDaily: number[] = data.map(({ AFF_FEE_EARNED_THOR }) => AFF_FEE_EARNED_THOR);
    const affiliateFees7dAverage = calculateMovingAverage(affiliateFeesDaily, 7);

    return affiliateFees7dAverage * 52;
  } catch (error) {
    return 0;
  }
};

export const fetchVthorApr = async (tvl: number) => {
  const vthorBlockReward = VTHOR_BLOCK_REWARD * BLOCKS_PER_YEAR;
  const buybackThor = await getThorBuyback().catch(() => 0);

  return ((vthorBlockReward + buybackThor) / tvl) * 100;
};
