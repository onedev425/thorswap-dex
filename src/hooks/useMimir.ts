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

import { useMidgard } from 'redux/midgard/hooks'

export const useMimir = () => {
  const { networkData, mimir } = useMidgard()

  const maxLiquidityRuneMimir = mimir?.MAXIMUMLIQUIDITYRUNE
  const maxLiquidityRune = Amount.fromMidgard(maxLiquidityRuneMimir)
  const totalPooledRune = Amount.fromMidgard(networkData?.totalPooledRune)

  // halt status
  const isTHORChainHalted = mimir?.HALTTHORCHAIN === 1
  const isBTCChainHalted = mimir?.HALTBTCCHAIN === 1
  const isETHChainHalted = mimir?.HALTETHCHAIN === 1
  const isBNBChainHalted = mimir?.HALTBNBCHAIN === 1
  const isLTCChainHalted = mimir?.HALTLTCCHAIN === 1
  const isBCHChainHalted = mimir?.HALTBCHCHAIN === 1
  const isDOGEChainHalted = mimir?.HALTDOGECHAIN === 1
  const isTERRAChainHalted = mimir?.HALTTERRACHAIN === 1
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
    [BTCChain]: mimir?.HALTBTCTRADING === 1,
    [BNBChain]: mimir?.HALTBNBTRADING === 1,
    [ETHChain]: mimir?.HALTETHTRADING === 1,
    [LTCChain]: mimir?.HALTLTCTRADING === 1,
    [BCHChain]: mimir?.HALTBCHTRADING === 1,
    [DOGEChain]: mimir?.HALTDOGETRADING === 1,
    [TERRAChain]: mimir?.HALTTERRATRADING === 1,
  }

  // pause LP

  const isPauseLP = mimir?.PAUSELP === 1
  const isChainPauseLP: {
    [key: string]: boolean
  } = {
    [BTCChain]: mimir?.PAUSELPBCH === 1,
    [BNBChain]: mimir?.PAUSELPBNB === 1,
    [ETHChain]: mimir?.PAUSELPBTC === 1,
    [LTCChain]: mimir?.PAUSELPETH === 1,
    [BCHChain]: mimir?.PAUSELPLTC === 1,
    [DOGEChain]: mimir?.PAUSELPDOGE === 1,
    [TERRAChain]: mimir?.PAUSELPTERRA === 1,
  }

  const isChainPauseLPAction = (key: string) => {
    if (isPauseLP) return true

    return isChainPauseLP?.[key] ?? false
  }

  const isFundsCapReached: boolean = useMemo(() => {
    if (!maxLiquidityRuneMimir) return false

    // totalPooledRune >= maxLiquidityRune - 100k RUNE
    return (
      maxLiquidityRune
        // .sub(Amount.fromMidgard(100000 * 10 ** 8))
        .lte(totalPooledRune)
    )
  }, [totalPooledRune, maxLiquidityRune, maxLiquidityRuneMimir])

  const capPercent = useMemo(() => {
    if (!maxLiquidityRuneMimir) return null

    // const poolLimit = maxLiquidityRune.sub(Amount.fromMidgard(100000 * 10 ** 8))
    const poolLimit = maxLiquidityRune

    return `${totalPooledRune.div(poolLimit).mul(100).toFixed(1)}%`
  }, [totalPooledRune, maxLiquidityRune, maxLiquidityRuneMimir])

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
  }
}
