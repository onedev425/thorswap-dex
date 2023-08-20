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
  const isTradingHalted = isEntryPaused('HALTTRADING');
  const isLPPaused = isEntryPaused('PAUSELP');
  const isSigningHalted = isEntryPaused('HALTSIGNING');
  const isGlobalHalted = isEntryPaused('HALTCHAINGLOBAL') || isSigningHalted;
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
    [Chain.Avalanche]: isTradingHalted || isEntryPaused('HALTAVAXTRADING'),
    [Chain.Binance]: isTradingHalted || isEntryPaused('HALTBNBTRADING'),
    [Chain.BitcoinCash]: isTradingHalted || isEntryPaused('HALTBCHTRADING'),
    [Chain.Bitcoin]: isTradingHalted || isEntryPaused('HALTBTCTRADING'),
    [Chain.Cosmos]: isTradingHalted || isEntryPaused('HALTGAIATRADING'),
    [Chain.Dogecoin]: isTradingHalted || isEntryPaused('HALTDOGETRADING'),
    [Chain.Ethereum]: isTradingHalted || isEntryPaused('HALTETHTRADING'),
    [Chain.Litecoin]: isTradingHalted || isEntryPaused('HALTLTCTRADING'),
  };

  // pause LP

  const isChainPauseLP: {
    [key: string]: boolean;
  } = {
    [Chain.Avalanche]: isLPPaused || isEntryPaused('PAUSELPAVAX'),
    [Chain.Binance]: isLPPaused || isEntryPaused('PAUSELPBNB'),
    [Chain.BitcoinCash]: isLPPaused || isEntryPaused('PAUSELPBCH'),
    [Chain.Bitcoin]: isLPPaused || isEntryPaused('PAUSELPBTC'),
    [Chain.Cosmos]: isLPPaused || isEntryPaused('HALTGAIATRADING'),
    [Chain.Dogecoin]: isLPPaused || isEntryPaused('PAUSELPDOGE'),
    [Chain.Ethereum]: isLPPaused || isEntryPaused('PAUSELPETH'),
    [Chain.Litecoin]: isLPPaused || isEntryPaused('PAUSELPLTC'),
  };

  const isChainPauseLPAction = (key: string) => {
    if (isLPPaused) return true;

    return isChainPauseLP?.[key] ?? false;
  };

  const maxSynthPerAssetDepth = useMemo(
    () => (mimir?.MAXSYNTHPERPOOLDEPTH === -1 ? 0 : mimir?.MAXSYNTHPERPOOLDEPTH ?? 0),
    [mimir?.MAXSYNTHPERPOOLDEPTH],
  );

  const synthCap = 2 * ((mimir.MAXSYNTHPERPOOLDEPTH || 0) / 10000);

  // Pause loans
  const isLendingPaused =
    !mimir || typeof mimir.PAUSELOANS !== 'number' ? false : mimir.PAUSELOANS > 0;

  return {
    isBCHChainHalted,
    isBNBChainHalted,
    isBTCChainHalted,
    isGlobalHalted,
    isChainHalted,
    isChainPauseLP,
    isChainPauseLPAction,
    isChainTradingHalted,
    isTradingHalted,
    isDOGEChainHalted,
    isETHChainHalted,
    isAVAXChainHalted,
    isGAIAChainHalted,
    isLTCChainHalted,
    isLPPaused,
    isTHORChainHalted,
    maxSynthPerAssetDepth,
    totalPooledRune,
    isLoaded: mimirLoaded,
    synthCap,
    isLendingPaused,
  };
};
