import { useGlobalState } from 'store/hooks'
import { useMidgard } from 'store/midgard/hooks'

import useInterval from 'hooks/useInterval'

import {
  POLL_GAS_RATE_INTERVAL,
  POLL_DATA_INTERVAL,
  POLL_GET_POOLS_INTERVAL,
} from 'settings/constants'

import { useEffectOnce } from './useEffectOnce'

/**
 * hooks for reloading all data
 * NOTE: useRefresh hooks should be imported and used only once, to avoid multiple usage of useInterval
 */
export const useGlobalRefresh = () => {
  const { getInboundData, getGlobalHistory, getPools } = useMidgard()
  const { refreshPage } = useGlobalState()

  useEffectOnce(() => {
    getInboundData()
    refreshPage()
    getGlobalHistory()
  })

  useInterval(() => {
    getInboundData()
  }, POLL_GAS_RATE_INTERVAL)

  useInterval(() => {
    refreshPage()
  }, POLL_DATA_INTERVAL)

  useInterval(() => {
    getPools()
  }, POLL_GET_POOLS_INTERVAL)
}
