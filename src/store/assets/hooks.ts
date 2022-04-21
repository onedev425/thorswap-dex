import { useCallback } from 'react'

import { actions } from 'store/assets/slice'
import { useAppDispatch, useAppSelector } from 'store/store'

export const useAssets = () => {
  const dispatch = useAppDispatch()
  const assetsState = useAppSelector(({ assets }) => assets)

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
