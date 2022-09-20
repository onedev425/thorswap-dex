import { FeeOption } from '@thorswap-lib/types';

const multiplier: Record<FeeOption, number> = {
  average: 0.67,
  fast: 1,
  fastest: 1.5,
};

export const getGasRateByFeeOption = ({
  gasRate,
  feeOptionType,
}: {
  gasRate?: string;
  feeOptionType: FeeOption;
}) => {
  return Number(gasRate || 0) * multiplier[feeOptionType];
};
