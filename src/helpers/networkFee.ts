import { Chain, FeeOption } from '@thorswap-lib/types';
import axios from 'axios';

export const GasUnitLabel: Record<Chain, string> = {
  [Chain.Bitcoin]: 'Sats',
  [Chain.Ethereum]: 'Gwei',
  [Chain.THORChain]: 'Rune',
  [Chain.Binance]: 'Jager', // https://academy.binance.com/en/glossary/jager
  [Chain.Doge]: 'Koinu',
  [Chain.Litecoin]: 'Litoshi',
  [Chain.BitcoinCash]: 'Sats',
  [Chain.Cosmos]: 'Sats',
  [Chain.Solana]: 'Sats',
  [Chain.Avalanche]: 'Gwei',
};

const multiplier: Record<FeeOption, number> = {
  average: 0.67,
  fast: 1,
  fastest: 1.5,
};

/// get doge gasrate from blockcypher oracle
export const getDogeGasRate = async () => {
  const DEFAULT_SUGGESTED_TRANSACTION_FEE = 500000;
  try {
    const response = await axios.get('https://api.blockcypher.com/v1/doge/main');
    return response.data.high_fee_per_kb / 1000; // feePerKb to feePerByte
  } catch (error) {
    return DEFAULT_SUGGESTED_TRANSACTION_FEE;
  }
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
