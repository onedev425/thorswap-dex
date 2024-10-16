// https://docs.thorchain.org/how-it-works/governance#mimir

import { BaseDecimal, Chain, SwapKitNumber } from "@swapkit/sdk";
import { useMemo } from "react";
import {
  useGetConstantsQuery,
  useGetLastblockQuery,
  useGetMimirQuery,
  useGetNetworkQuery,
} from "store/midgard/api";
import type { MimirData } from "store/midgard/types";

export const useMimir = () => {
  const { data: mimirData } = useGetMimirQuery(undefined, { pollingInterval: 60000 });
  const { data: constantsData } = useGetConstantsQuery(undefined, { pollingInterval: 60000 });
  const { data: networkData } = useGetNetworkQuery(undefined, { pollingInterval: 60000 });
  const { data: lastBlock } = useGetLastblockQuery();
  const tcLastBlock = lastBlock?.[0]?.thorchain;

  const mimir = useMemo(() => {
    const mergedConfig = {
      ...(constantsData
        ? Object.fromEntries(
            Object.entries(constantsData).flatMap(([_, value]) =>
              Object.entries(value).map(([key, val]) => [key.toUpperCase(), val]),
            ),
          )
        : {}),
      ...mimirData,
    };
    return mergedConfig || ({} as MimirData);
  }, [mimirData, constantsData]);

  const totalPooledRune = SwapKitNumber.fromBigInt(BigInt(networkData?.totalPooledRune || 0), 8);

  const isEntryPaused = (entry: keyof MimirData) => {
    if (!mimir || typeof mimir[entry] !== "number") {
      return false;
    }

    const mimirEntry = mimir[entry] as number;

    return (
      mimir.HALTCHAINGLOBAL === 1 || (mimirEntry > 0 && mimirEntry <= (tcLastBlock as number))
    );
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
  const isRunePoolHalted = !isEntryPaused("RUNEPOOLENABLED");
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

  const runePoolDepositMaturityBlocks = useMemo(
    () => mimir?.RUNEPOOLDEPOSITMATURITYBLOCKS ?? 0,
    [mimir],
  );

  const runePoolMaxReserveBackstop = useMemo(
    () =>
      SwapKitNumber.fromBigInt(BigInt(mimir?.RUNEPOOLMAXRESERVEBACKSTOP || 0), BaseDecimal.THOR),
    [mimir?.RUNEPOOLMAXRESERVEBACKSTOP],
  );

  const polMaxNetworkDeposit = useMemo(
    () => SwapKitNumber.fromBigInt(BigInt(mimir?.POLMAXNETWORKDEPOSIT || 0), BaseDecimal.THOR),
    [mimir?.POLMAXNETWORKDEPOSIT],
  );

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
    isRunePoolHalted,
    runePoolDepositMaturityBlocks,
    runePoolMaxReserveBackstop,
    polMaxNetworkDeposit,
  };
};
