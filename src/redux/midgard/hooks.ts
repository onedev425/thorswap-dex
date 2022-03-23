import { useMidgard as useLibMidgard } from '@thorswap-lib/thorswap-client/lib/redux/midgard/hooks'

import { useAppDispatch, useAppSelector } from 'redux/store'

import { TX_PUBLIC_PAGE_LIMIT } from 'settings/constants/global'

export const useMidgard = () => {
  const dispatch = useAppDispatch()
  const midgardState = useAppSelector((state) => state.midgard)

  return useLibMidgard({ TX_PUBLIC_PAGE_LIMIT, dispatch, midgardState })
}
