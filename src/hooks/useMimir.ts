// https://docs.thorchain.org/how-it-works/governance#mimir

import { Amount } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';
import { MimirData } from 'store/midgard/types';

export const useMimir = () => {
  const { networkData, mimir, mimirLoaded } = useMidgard();

  const totalPooledRune = Amount.fromMidgard(networkData?.totalPooledRune);

  const isEntryPaused = (entry: keyof MimirData) => {
    if (!mimir || typeof mimir[entry] !== 'number') {
      return false;
    }

    return mimir?.HALTCHAINGLOBAL === 1 || mimir[entry] !== 0;
  };

  // halt status
  const isGlobalHalted = isEntryPaused('HALTCHAINGLOBAL');
  const isAVAXChainHalted = isEntryPaused('HALTAVAXCHAIN');
  const isGAIAChainHalted = isEntryPaused('HALTGAIACHAIN');
  const isTHORChainHalted = isEntryPaused('HALTTHORCHAIN');
  const isBTCChainHalted = isEntryPaused('HALTBTCCHAIN');
  const isETHChainHalted = isEntryPaused('HALTETHCHAIN') || isEntryPaused('SOLVENCYHALTETHCHAIN');
  const isBNBChainHalted = isEntryPaused('HALTBNBCHAIN');
  const isLTCChainHalted = isEntryPaused('HALTLTCCHAIN');
  const isBCHChainHalted = isEntryPaused('HALTBCHCHAIN') || isEntryPaused('SOLVENCYHALTBCHCHAIN');
  const isDOGEChainHalted = isEntryPaused('HALTDOGECHAIN');
  const isChainHalted: {
    [key: string]: boolean;
  } = {
    [Chain.Avalanche]: isAVAXChainHalted,
    [Chain.BitcoinCash]: isBCHChainHalted,
    [Chain.Binance]: isBNBChainHalted,
    [Chain.Bitcoin]: isBTCChainHalted,
    [Chain.Cosmos]: isGAIAChainHalted,
    [Chain.Dogecoin]: isDOGEChainHalted,
    [Chain.Ethereum]: isETHChainHalted,
    [Chain.Litecoin]: isLTCChainHalted,
    [Chain.THORChain]: isTHORChainHalted,
  };

  // halt trading status
  const isChainTradingHalted: {
    [key: string]: boolean;
  } = {
    [Chain.Avalanche]: isEntryPaused('HALTAVAXTRADING'),
    [Chain.BitcoinCash]: isEntryPaused('HALTBCHTRADING'),
    [Chain.Binance]: isEntryPaused('HALTBNBTRADING'),
    [Chain.Bitcoin]: isEntryPaused('HALTBTCTRADING'),
    [Chain.Cosmos]: isEntryPaused('HALTGAIATRADING'),
    [Chain.Dogecoin]: isEntryPaused('HALTDOGETRADING'),
    [Chain.Ethereum]: isEntryPaused('HALTETHTRADING'),
    [Chain.Litecoin]: isEntryPaused('HALTLTCTRADING'),
  };

  // pause LP

  const isPauseLP = mimir?.PAUSELP === 1;
  const isChainPauseLP: {
    [key: string]: boolean;
  } = {
    [Chain.Avalanche]: isEntryPaused('PAUSELPAVAX'),
    [Chain.Binance]: isEntryPaused('PAUSELPBNB'),
    [Chain.BitcoinCash]: isEntryPaused('PAUSELPBCH'),
    [Chain.Bitcoin]: isEntryPaused('PAUSELPBTC'),
    [Chain.Dogecoin]: isEntryPaused('PAUSELPDOGE'),
    [Chain.Ethereum]: isEntryPaused('PAUSELPETH'),
    [Chain.Litecoin]: isEntryPaused('PAUSELPLTC'),
  };

  const isChainPauseLPAction = (key: string) => {
    if (isPauseLP) return true;

    return isChainPauseLP?.[key] ?? false;
  };

  const maxSynthPerAssetDepth = useMemo(
    () => (mimir?.MAXSYNTHPERPOOLDEPTH === -1 ? 0 : mimir?.MAXSYNTHPERPOOLDEPTH ?? 0),
    [mimir?.MAXSYNTHPERPOOLDEPTH],
  );

  const synthCap = 2 * ((mimir.MAXSYNTHPERPOOLDEPTH || 0) / 10000);

  return {
    isBCHChainHalted,
    isBNBChainHalted,
    isBTCChainHalted,
    isGlobalHalted,
    isChainHalted,
    isChainPauseLP,
    isChainPauseLPAction,
    isChainTradingHalted,
    isDOGEChainHalted,
    isETHChainHalted,
    isAVAXChainHalted,
    isGAIAChainHalted,
    isLTCChainHalted,
    isPauseLP,
    isTHORChainHalted,
    maxSynthPerAssetDepth,
    totalPooledRune,
    isLoaded: mimirLoaded,
    synthCap,
  };
};
