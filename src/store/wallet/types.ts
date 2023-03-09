export interface GeckoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  atl_change_percentage: number;
  roi: null;
  last_updated: Date;
  sparkline_in_7d: {
    price: number[];
  };
}

export type GeckoDataWithSymbols = { geckoData: GeckoData; symbol: string };

export type DerivationPathType = 'nativeSegwitMiddleAccount' | 'segwit' | 'legacy' | 'ledgerLive';
