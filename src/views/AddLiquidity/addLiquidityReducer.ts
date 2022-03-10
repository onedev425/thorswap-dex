import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetInputType } from 'components/AssetInput/types'

export type AddLiquidityState = {
  firstAsset: AssetInputType
  secondAsset: AssetInputType
}

export type AddLiquidityActions =
  | { type: 'setSecondAsset' | 'setFirstAsset'; payload: Asset }
  | {
      type: 'setSecondAssetValue' | 'setFirstAssetValue'
      payload: string
    }

export const addLiquidityReducer = (
  state: AddLiquidityState,
  actions: AddLiquidityActions,
): AddLiquidityState => {
  switch (actions.type) {
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

    default:
      return state
  }
}
