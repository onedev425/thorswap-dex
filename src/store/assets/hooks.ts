import { useCallback } from 'react'

import { actions } from 'store/assets/slice'
import { useAppDispatch } from 'store/store'

export const useAssets = () => {
  const dispatch = useAppDispatch()

  const addFrequent = useCallback(
    (asset: string) => {
      dispatch(actions.addFrequent(asset))
    },
    [dispatch],
  )

  const addFeatured = useCallback(
    (asset: string) => {
      dispatch(actions.addFeatured(asset))
    },
    [dispatch],
  )

  const removeFeatured = useCallback(
    (asset: string) => {
      dispatch(actions.removeFeatured(asset))
    },
    [dispatch],
  )

  const toggleTokenList = useCallback(
    (tokenListName: string) => {
      dispatch(actions.toggleTokenList(tokenListName))
    },
    [dispatch],
  )

  return {
    addFrequent,
    toggleTokenList,
    addFeatured,
    removeFeatured,
  }
}
