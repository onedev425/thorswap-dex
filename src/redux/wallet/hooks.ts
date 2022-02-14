import { useCallback } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { RootState } from 'redux/store'

import { actions } from './slice'

export const useWallet = () => {
  const dispatch = useDispatch()

  const walletState = useSelector((state: RootState) => state.wallet)

  const setIsConnectModalOpen = useCallback(
    (visible: boolean) => {
      dispatch(actions.setIsConnectModalOpen(visible))
    },
    [dispatch],
  )

  return {
    ...walletState,
    setIsConnectModalOpen,
  }
}
