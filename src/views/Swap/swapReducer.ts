import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetInputType } from 'components/AssetInput/types'

export type SwapState = {
  isOpened: boolean
  expertMode: boolean
  autoRouter: boolean
  slippage: number
  firstAsset: AssetInputType
  secondAsset: AssetInputType
}

export type SwapActions =
  | { type: 'swapAssets' }
  | { type: 'setSlippage'; payload: number }
  | {
      type: 'setAutoRouter' | 'setExpertMode' | 'setIsOpened'
      payload: boolean
    }
  | { type: 'setSecondAsset' | 'setFirstAsset'; payload: Asset }
  | {
      type: 'setSecondAssetValue' | 'setFirstAssetValue'
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

    case 'setFirstAssetValue': {
      const secondAssetValue =
        (parseFloat(actions.payload) * parseFloat(state.firstAsset.price)) /
          parseFloat(state.secondAsset.price) || 0

      return {
        ...state,
        firstAsset: { ...state.firstAsset, value: actions.payload },
        secondAsset: { ...state.secondAsset, value: `${secondAssetValue}` },
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

    case 'setSecondAssetValue': {
      const firstAssetValue =
        (parseFloat(actions.payload) * parseFloat(state.secondAsset.price)) /
          parseFloat(state.firstAsset.price) || 0

      return {
        ...state,
        secondAsset: { ...state.secondAsset, value: actions.payload },
        firstAsset: { ...state.firstAsset, value: `${firstAssetValue}` },
      }
    }

    case 'setSlippage': {
      return { ...state, slippage: actions.payload }
    }

    case 'setAutoRouter': {
      return { ...state, autoRouter: actions.payload }
    }

    case 'setExpertMode': {
      return { ...state, expertMode: actions.payload }
    }

    case 'setIsOpened': {
      return { ...state, isOpened: actions.payload }
    }

    default:
      return state
  }
}
