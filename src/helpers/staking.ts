import { RequestClient } from '@swapkit/core';
import { getBlockRewards } from 'services/contract';

export const BLOCKS_PER_YEAR = 6432 * 365;

const getThorBuyback = async () => {
  try {
    const data = await RequestClient.get<
      [{ DATE: string; AFF_ADDRESS: string; AFF_FEE_EARNED_THOR: number }]
    >(
      'https://api.flipsidecrypto.com/api/v2/queries/9daa6cd4-8e78-4432-bdd7-a5f0fc480229/data/latest',
    );

    const daysWindow = 7;
    const fees = data.map(({ AFF_FEE_EARNED_THOR }) => AFF_FEE_EARNED_THOR);
    const last7days = fees.length >= daysWindow ? fees.slice(-daysWindow) : fees;
    const affiliateFees7dAverage = last7days.reduce((prev, current) => prev + current, 0);

    return affiliateFees7dAverage * 52;
  } catch (error: NotWorth) {
    console.error(error);
    return 0;
  }
};

export const fetchVthorApr = async (tvl: number) => {
  const vthorBlockReward = (await getBlockRewards()) * BLOCKS_PER_YEAR;
  const buybackThor = await getThorBuyback().catch(() => 0);

  return ((vthorBlockReward + buybackThor) / tvl) * 100;
};
