import { RequestClient } from "@swapkit/sdk";
import { getBlockRewards } from "services/contract";
import { logException } from "services/logger";

type FlipSideData = {
  DATE: string;
  FROM_ASSET: string;
  TOTAL_FROM_AMT: number;
  AVG_RUNE_PRICE_USD: number;
  TOTAL_FROM_AMT_USD: number;
  AFF_FEE_EARNED_THOR: number;
  TO_ASSET: string;
  TOTAL_TO_AMT: number;
  AVG_THOR_PRICE_USD: number;
  TOTAL_TO_AMT_USD: number;
};

/**
 * 1 block every 12 seconds
 */
export const BLOCKS_PER_YEAR = 7200 * 365;
const periodInDays = 30;

/**
 * daily $THOR affiliateEarned -> take last periodInDays days -> sum -> avg -> multiply by 52 weeks
 */
const getEstimatedYearlyThorBuyback = (data: FlipSideData[]) => {
  const dataFromPeriod = data.slice(-periodInDays);
  const fees = dataFromPeriod.reduce(
    (prev, current) => ({
      AFF_FEE_EARNED_THOR: prev.AFF_FEE_EARNED_THOR + current.TOTAL_TO_AMT,
      AFF_FEE_EARNED_USD: prev.AFF_FEE_EARNED_USD + current.TOTAL_TO_AMT_USD,
    }),
    { AFF_FEE_EARNED_THOR: 0, AFF_FEE_EARNED_USD: 0 },
  );

  return (fees.AFF_FEE_EARNED_THOR / periodInDays) * 365;
};

const getThorBuybackYear = async () => {
  const { timestamp, cacheData } = JSON.parse(localStorage.getItem("thorBuybackData") || "{}");

  if (cacheData && Date.now() < timestamp) return getEstimatedYearlyThorBuyback(cacheData);

  try {
    const data: FlipSideData[] = await RequestClient.get(
      // 'https://api.flipsidecrypto.com/api/v2/queries/9daa6cd4-8e78-4432-bdd7-a5f0fc480229/data/latest', // OLD QUERY
      "https://api.flipsidecrypto.com/api/v2/queries/e9f162da-2217-4855-9258-7f2dc144996f/data/latest",
    );

    localStorage.setItem(
      "thorBuybackData",
      JSON.stringify({ timestamp: Date.now() + 1000 * 60 * 60, cacheData: data }),
    );

    return getEstimatedYearlyThorBuyback(data);
  } catch (error) {
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
    realYieldApy: (buybackThorYear / tvl) * 100,
    emissionsApy: (thorBlockRewardsYear / tvl) * 100,
  };
};
