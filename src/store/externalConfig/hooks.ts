import { useCallback } from 'react'

import { actions } from 'store/externalConfig/slice'
import { useAppDispatch, useAppSelector } from 'store/store'

import { loadConfig } from './loadConfig'
import { AnnouncementsData } from './types'

export const useExternalConfig = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector((state) => state.externalConfig)

  const setAnnouncements = useCallback(
    (announcements: AnnouncementsData) => {
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
    const announcements = await loadConfig()
    setAnnouncements(announcements)
  }, [setAnnouncements])

  return {
    ...state,
    setAnnouncements,
    setTradingGloballyDisabled,
    refreshExternalConfig,
  }
}
