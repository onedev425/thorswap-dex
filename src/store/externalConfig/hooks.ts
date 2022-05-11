import { useCallback } from 'react'

import { actions } from 'store/externalConfig/slice'
import { Announcement } from 'store/externalConfig/types'
import { useAppDispatch, useAppSelector } from 'store/store'

import { loadConfig } from './loadConfig'

export const useExternalConfig = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector((state) => state.externalConfig)

  const setAnnouncements = useCallback(
    (announcements: Announcement[]) => {
      dispatch(actions.setAnnouncements(announcements))
    },
    [dispatch],
  )

  const setTradingGloballyDisabled = useCallback(
    (isDisabled: boolean) => {
      dispatch(actions.setTradingGloballyDisabled(isDisabled))
    },
    [dispatch],
  )

  const refreshExternalConfig = useCallback(async () => {
    const { announcements, isTradingGloballyDisabled } = await loadConfig()
    setAnnouncements(announcements)
    setTradingGloballyDisabled(isTradingGloballyDisabled)
  }, [setAnnouncements, setTradingGloballyDisabled])

  return {
    ...state,
    setAnnouncements,
    setTradingGloballyDisabled,
    refreshExternalConfig,
  }
}
