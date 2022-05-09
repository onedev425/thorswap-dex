// https://docs.thorchain.org/how-it-works/governance#mimir

import { useMemo } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'
import {
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
  DOGEChain,
  TERRAChain,
} from '@thorswap-lib/xchain-util'

import { useMidgard } from 'store/midgard/hooks'
import { MimirData } from 'store/midgard/types'

import { useGlobalStats } from 'hooks/useGlobalStats'

export const useMimir = () => {
  const { networkData, mimir } = useMidgard()
  const { totalActiveBond } = useGlobalStats()

  // const maxLiquidityRuneMimir = mimir?.MAXIMUMLIQUIDITYRUNE
  // const maxLiquidityRune = Amount.fromMidgard(maxLiquidityRuneMimir)
  const maxLiquidityRune = totalActiveBond
  const totalPooledRune = Amount.fromMidgard(networkData?.totalPooledRune)

  const isEntryPaused = (entry: keyof MimirData) => {
    if (!mimir || typeof mimir[entry] !== 'number') {
      return false
    }

    return mimir[entry] !== 0
  }

  // halt status
  const isTHORChainHalted = isEntryPaused('HALTTHORCHAIN')
  const isBTCChainHalted = isEntryPaused('HALTBTCCHAIN')
  const isETHChainHalted = isEntryPaused('HALTETHCHAIN')
  const isBNBChainHalted = isEntryPaused('HALTBNBCHAIN')
  const isLTCChainHalted = isEntryPaused('HALTLTCCHAIN')
  const isBCHChainHalted = isEntryPaused('HALTBCHCHAIN')
  const isDOGEChainHalted = isEntryPaused('HALTDOGECHAIN')
  const isTERRAChainHalted = isEntryPaused('HALTTERRACHAIN')
  const isChainHalted: {
    [key: string]: boolean
  } = {
    [BTCChain]: isBTCChainHalted,
    [BNBChain]: isBNBChainHalted,
    [ETHChain]: isETHChainHalted,
    [LTCChain]: isLTCChainHalted,
    [BCHChain]: isBCHChainHalted,
    [THORChain]: isTHORChainHalted,
    [DOGEChain]: isDOGEChainHalted,
    [TERRAChain]: isTERRAChainHalted,
  }

  // halt trading status
  const isChainTradingHalted: {
    [key: string]: boolean
  } = {
    [BTCChain]: isEntryPaused('HALTBTCTRADING'),
    [BNBChain]: isEntryPaused('HALTBNBTRADING'),
    [ETHChain]: isEntryPaused('HALTETHTRADING'),
    [LTCChain]: isEntryPaused('HALTLTCTRADING'),
    [BCHChain]: isEntryPaused('HALTBCHTRADING'),
    [DOGEChain]: isEntryPaused('HALTDOGETRADING'),
    [TERRAChain]: isEntryPaused('HALTTERRATRADING'),
  }

  // pause LP

  const isPauseLP = mimir?.PAUSELP === 1
  const isChainPauseLP: {
    [key: string]: boolean
  } = {
    [BTCChain]: isEntryPaused('PAUSELPBCH'),
    [BNBChain]: isEntryPaused('PAUSELPBNB'),
    [ETHChain]: isEntryPaused('PAUSELPBTC'),
    [LTCChain]: isEntryPaused('PAUSELPETH'),
    [BCHChain]: isEntryPaused('PAUSELPLTC'),
    [DOGEChain]: isEntryPaused('PAUSELPDOGE'),
    [TERRAChain]: isEntryPaused('PAUSELPTERRA'),
  }

  const isChainPauseLPAction = (key: string) => {
    if (isPauseLP) return true

    return isChainPauseLP?.[key] ?? false
  }

  const isFundsCapReached: boolean = useMemo(() => {
    // if (!maxLiquidityRuneMimir) return false

    // totalPooledRune >= maxLiquidityRune - 100k RUNE
    return (
      maxLiquidityRune
        // .sub(Amount.fromMidgard(100000 * 10 ** 8))
        .lte(totalPooledRune)
    )
  }, [totalPooledRune, maxLiquidityRune])

  const capPercent = useMemo(() => {
    // if (!maxLiquidityRuneMimir) return null

    // const poolLimit = maxLiquidityRune.sub(Amount.fromMidgard(100000 * 10 ** 8))
    const poolLimit = maxLiquidityRune

    return `${totalPooledRune.div(poolLimit).mul(100).toFixed(1)}%`
  }, [totalPooledRune, maxLiquidityRune])

  const maxSynthPerAssetDepth = useMemo(
    () =>
      mimir?.MAXSYNTHPERASSETDEPTH === -1
        ? 0
        : mimir?.MAXSYNTHPERASSETDEPTH ?? 0,
    [mimir?.MAXSYNTHPERASSETDEPTH],
  )

  return {
    totalPooledRune,
    maxLiquidityRune,
    isFundsCapReached,
    capPercent,
    isChainHalted,
    isChainTradingHalted,
    isTHORChainHalted,
    isBTCChainHalted,
    isETHChainHalted,
    isBNBChainHalted,
    isLTCChainHalted,
    isBCHChainHalted,
    isDOGEChainHalted,
    isTERRAChainHalted,
    isPauseLP,
    isChainPauseLP,
    isChainPauseLPAction,
    maxSynthPerAssetDepth,
  }
}
