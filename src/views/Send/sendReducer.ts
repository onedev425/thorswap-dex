import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetInputType } from 'components/AssetInput/types'

export type SendState = {
  address: string
  memo: string
  asset: AssetInputType
  isOpened: boolean
}

export type SendActions =
  | { type: 'setAsset'; payload: Asset }
  | { type: 'setMemo' | 'setAssetValue' | 'setAddress'; payload: string }
  | { type: 'setIsOpened'; payload: boolean }

export const sendReducer = (
  state: SendState,
  actions: SendActions,
): SendState => {
  switch (actions.type) {
    case 'setAsset':
      return { ...state, asset: { ...state.asset, asset: actions.payload } }

    case 'setAssetValue': {
      return { ...state, asset: { ...state.asset, value: actions.payload } }
    }

    case 'setIsOpened': {
      return { ...state, isOpened: actions.payload }
    }

    case 'setAddress': {
      return { ...state, address: actions.payload }
    }

    case 'setMemo': {
      return { ...state, memo: actions.payload }
    }

    default:
      return state
  }
}
