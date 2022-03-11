export const BLOCKS_PER_DAY = 6432
export const BLOCKS_PER_MONTH = BLOCKS_PER_DAY * 30
export const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365

// const THOR_PRICE = 1.5
// const THOR_REWARDS_PER_BLOCK = 20

// APR = (dailyBlockRewards / totalAmount) * 365
export const getAPR = (blockReward: number, totalAmount: number) => {
  if (totalAmount === 0) return Number.MAX_SAFE_INTEGER
  return ((blockReward * BLOCKS_PER_YEAR) / totalAmount) * 100
}

// APY = (daily ROI + 1) ^ 365
export const getAPY = (blockReward: number, totalAmount: number) => {
  if (totalAmount === 0) return Number.MAX_SAFE_INTEGER

  const dailyROI = (blockReward * BLOCKS_PER_DAY) / totalAmount

  return ((1 + dailyROI) ** 365 - 1) * 100
}

export const apr2apy = (apr: number) => {
  return ((1 + apr / 100 / 365) ** 365 - 1) * 100
}

export const apr2blockReward = (apr: number, totalAmount: number) => {
  return (apr * totalAmount) / 100 / BLOCKS_PER_YEAR
}
