// https://docs.thorchain.org/how-it-works/governance#mimir

import { Chain, SwapKitNumber } from "@swapkit/sdk";
import { useMemo } from "react";
import { useGetMimirQuery, useGetNetworkQuery } from "store/midgard/api";
import type { MimirData } from "store/midgard/types";

export const useMimir = () => {
  const { data } = useGetMimirQuery(undefined, { pollingInterval: 60000 });
  const { data: networkData } = useGetNetworkQuery(undefined, { pollingInterval: 60000 });
  const mimir = useMemo(() => data || ({} as MimirData), [data]);

  const totalPooledRune = SwapKitNumber.fromBigInt(BigInt(networkData?.totalPooledRune || 0), 8);

  const isEntryPaused = (entry: keyof MimirData) => {
    if (!mimir || typeof mimir[entry] !== "number") {
      return false;
    }

    return mimir?.HALTCHAINGLOBAL === 1 || mimir[entry] !== 0;
  };

  // halt status
  const isTradingHalted = isEntryPaused("HALTTRADING");
  const isLPPaused = isEntryPaused("PAUSELP");
  const isSigningHalted = isEntryPaused("HALTSIGNING");
  const isGlobalHalted = isEntryPaused("HALTCHAINGLOBAL") || isSigningHalted;
  const isAVAXChainHalted = isEntryPaused("HALTAVAXCHAIN");
  const isGAIAChainHalted =
    isEntryPaused("HALTGAIACHAIN") || isEntryPaused("SOLVENCYHALTGAIACHAIN");
  const isTHORChainHalted = isEntryPaused("HALTTHORCHAIN");
  const isBTCChainHalted = isEntryPaused("HALTBTCCHAIN");
  const isETHChainHalted = isEntryPaused("HALTETHCHAIN") || isEntryPaused("SOLVENCYHALTETHCHAIN");
  const isBNBChainHalted = true;
  const isLTCChainHalted = isEntryPaused("HALTLTCCHAIN");
  const isBCHChainHalted = isEntryPaused("HALTBCHCHAIN") || isEntryPaused("SOLVENCYHALTBCHCHAIN");
  const isDOGEChainHalted = isEntryPaused("HALTDOGECHAIN");
  const isBSCChainHalted = isEntryPaused("HALTBSCCHAIN");
  const isChainHalted: {
    [key: string]: boolean;
  } = {
    [Chain.Avalanche]: isAVAXChainHalted,
    [Chain.BitcoinCash]: isBCHChainHalted,
    [Chain.Bitcoin]: isBTCChainHalted,
    [Chain.BinanceSmartChain]: isBSCChainHalted,
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
    [Chain.Avalanche]: isTradingHalted || isEntryPaused("HALTAVAXTRADING"),
    [Chain.BitcoinCash]: isTradingHalted || isEntryPaused("HALTBCHTRADING"),
    [Chain.Bitcoin]: isTradingHalted || isEntryPaused("HALTBTCTRADING"),
    [Chain.BinanceSmartChain]: isTradingHalted || isEntryPaused("HALTBSCTRADING"),
    [Chain.Cosmos]: isTradingHalted || isEntryPaused("HALTGAIATRADING"),
    [Chain.Dogecoin]: isTradingHalted || isEntryPaused("HALTDOGETRADING"),
    [Chain.Ethereum]: isTradingHalted || isEntryPaused("HALTETHTRADING"),
    [Chain.Litecoin]: isTradingHalted || isEntryPaused("HALTLTCTRADING"),
  };

  // pause LP

  const isChainPauseLP: {
    [key: string]: boolean;
  } = {
    [Chain.Avalanche]: isLPPaused || isEntryPaused("PAUSELPAVAX"),
    [Chain.BitcoinCash]: isLPPaused || isEntryPaused("PAUSELPBCH"),
    [Chain.Bitcoin]: isLPPaused || isEntryPaused("PAUSELPBTC"),
    [Chain.BinanceSmartChain]: isLPPaused || isEntryPaused("PAUSELPBSC"),
    [Chain.Cosmos]: isLPPaused || isEntryPaused("PAUSELPGAIA"),
    [Chain.Dogecoin]: isLPPaused || isEntryPaused("PAUSELPDOGE"),
    [Chain.Ethereum]: isLPPaused || isEntryPaused("PAUSELPETH"),
    [Chain.Litecoin]: isLPPaused || isEntryPaused("PAUSELPLTC"),
  };

  const isChainPauseLPAction = (key: string) => {
    if (isLPPaused) return true;

    return isChainPauseLP?.[key] ?? false;
  };

  const maxSynthPerAssetDepth = useMemo(
    () => (mimir?.MAXSYNTHPERPOOLDEPTH === -1 ? 0 : mimir?.MAXSYNTHPERPOOLDEPTH ?? 0),
    [mimir?.MAXSYNTHPERPOOLDEPTH],
  );

  const synthCap = 2 * ((mimir?.MAXSYNTHPERPOOLDEPTH || 0) / 10000);
  const isLendingPaused = typeof mimir?.PAUSELOANS !== "number" ? true : mimir?.PAUSELOANS > 0;

  return {
    isBCHChainHalted,
    isBNBChainHalted,
    isBTCChainHalted,
    isBSCChainHalted,
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
    synthCap,
    isLendingPaused,
  };
};
