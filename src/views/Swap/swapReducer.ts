import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetInputType } from 'components/AssetInput/types'

export type SwapState = {
  slippage: number
  firstAsset: AssetInputType
  secondAsset: AssetInputType
}

export type SwapActions =
  | { type: 'swapAssets' }
  | { type: 'setSlippage'; payload: number }
  | { type: 'setSecondAsset' | 'setFirstAsset'; payload: Asset }
  | {
      type: 'setSecondAssetBalance' | 'setFirstAssetBalance'
      payload: string
    }

export const swapReducer = (
  state: SwapState,
  actions: SwapActions,
): SwapState => {
  switch (actions.type) {
    case 'swapAssets':
      return {
        ...state,
        firstAsset: state.secondAsset,
        secondAsset: state.firstAsset,
      }

    case 'setFirstAsset':
      return {
        ...state,
        firstAsset: { ...state.firstAsset, asset: actions.payload },
        secondAsset:
          state.secondAsset.asset === actions.payload
            ? state.firstAsset
            : state.secondAsset,
      }

    case 'setFirstAssetBalance': {
      const secondAssetBalance =
        (parseFloat(actions.payload) * parseFloat(state.firstAsset.value)) /
          parseFloat(state.secondAsset.value) || 0

      return {
        ...state,
        firstAsset: { ...state.firstAsset, balance: actions.payload },
        secondAsset: { ...state.secondAsset, balance: `${secondAssetBalance}` },
      }
    }

    case 'setSecondAsset':
      return {
        ...state,
        secondAsset: { ...state.secondAsset, asset: actions.payload },
        firstAsset:
          state.secondAsset.asset === actions.payload
            ? state.firstAsset
            : state.secondAsset,
      }

    case 'setSecondAssetBalance': {
      const firstAssetBalance =
        (parseFloat(actions.payload) * parseFloat(state.secondAsset.value)) /
          parseFloat(state.firstAsset.value) || 0

      return {
        ...state,
        secondAsset: { ...state.secondAsset, balance: actions.payload },
        firstAsset: { ...state.firstAsset, balance: `${firstAssetBalance}` },
      }
    }

    case 'setSlippage': {
      return { ...state, slippage: actions.payload }
    }

    default:
      return state
  }
}
