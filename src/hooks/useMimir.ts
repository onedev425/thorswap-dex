// https://docs.thorchain.org/how-it-works/governance#mimir

import { Amount } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { useGlobalStats } from 'hooks/useGlobalStats';
import { useMemo } from 'react';
import { useExternalConfig } from 'store/externalConfig/hooks';
import { useMidgard } from 'store/midgard/hooks';
import { MimirData } from 'store/midgard/types';

export const useMimir = () => {
  const { networkData, mimir } = useMidgard();
  const { totalActiveBond } = useGlobalStats();
  const { isTradingGloballyDisabled } = useExternalConfig();

  // const maxLiquidityRuneMimir = mimir?.MAXIMUMLIQUIDITYRUNE
  // const maxLiquidityRune = Amount.fromMidgard(maxLiquidityRuneMimir)
  const maxLiquidityRune = totalActiveBond;
  const totalPooledRune = Amount.fromMidgard(networkData?.totalPooledRune);

  const isEntryPaused = (entry: keyof MimirData) => {
    if (isTradingGloballyDisabled) {
      return true;
    }

    if (!mimir || typeof mimir[entry] !== 'number') {
      return false;
    }

    return mimir[entry] !== 0;
  };

  // halt status
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
    [Chain.Doge]: isDOGEChainHalted,
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
    [Chain.Doge]: isEntryPaused('HALTDOGETRADING'),
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
    [Chain.Doge]: isEntryPaused('PAUSELPDOGE'),
    [Chain.Ethereum]: isEntryPaused('PAUSELPETH'),
    [Chain.Litecoin]: isEntryPaused('PAUSELPLTC'),
  };

  const isChainPauseLPAction = (key: string) => {
    if (isPauseLP) return true;

    return isChainPauseLP?.[key] ?? false;
  };

  const isFundsCapReached: boolean = useMemo(() => {
    // if (!maxLiquidityRuneMimir) return false

    // totalPooledRune >= maxLiquidityRune - 100k RUNE
    return (
      maxLiquidityRune
        // .sub(Amount.fromMidgard(100000 * 10 ** 8))
        .lte(totalPooledRune)
    );
  }, [totalPooledRune, maxLiquidityRune]);

  const capPercent = useMemo(() => {
    // if (!maxLiquidityRuneMimir) return null

    // const poolLimit = maxLiquidityRune.sub(Amount.fromMidgard(100000 * 10 ** 8))
    const poolLimit = maxLiquidityRune;

    return `${totalPooledRune.div(poolLimit).mul(100).toFixed(1)}%`;
  }, [totalPooledRune, maxLiquidityRune]);

  const maxSynthPerAssetDepth = useMemo(
    () => (mimir?.MAXSYNTHPERASSETDEPTH === -1 ? 0 : mimir?.MAXSYNTHPERASSETDEPTH ?? 0),
    [mimir?.MAXSYNTHPERASSETDEPTH],
  );

  return {
    capPercent,
    isBCHChainHalted,
    isBNBChainHalted,
    isBTCChainHalted,
    isChainHalted,
    isChainPauseLP,
    isChainPauseLPAction,
    isChainTradingHalted,
    isDOGEChainHalted,
    isETHChainHalted,
    isFundsCapReached,
    isAVAXChainHalted,
    isGAIAChainHalted,
    isLTCChainHalted,
    isPauseLP,
    isTHORChainHalted,
    maxLiquidityRune,
    maxSynthPerAssetDepth,
    totalPooledRune,
  };
};
