import { useCallback } from 'react'

import { useSelector } from 'react-redux'

import { actions } from 'redux/assets/slice'
import { RootState, useAppDispatch } from 'redux/store'

export const useAssets = () => {
  const dispatch = useAppDispatch()
  const assetsState = useSelector((state: RootState) => state.assets)

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

  return {
    ...assetsState,
    addFrequent,
    addFeatured,
    removeFeatured,
  }
}
