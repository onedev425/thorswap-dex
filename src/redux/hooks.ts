import { useCallback } from 'react'

import { useMidgard } from 'redux/midgard/hooks'
import { useAppDispatch } from 'redux/store'

/**
 * hooks for managing global state per page, loading etc
 */
export const useGlobalState = () => {
  const dispatch = useAppDispatch()
  const { actions } = useMidgard()

  const loadInitialData = useCallback(() => {
    dispatch(actions.getPools())
  }, [dispatch, actions])

  const refreshPage = useCallback(() => {
    dispatch(actions.getPools())
  }, [dispatch, actions])

  return {
    loadInitialData,
    refreshPage,
  }
}
