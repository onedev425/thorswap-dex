import { useCallback, useState } from 'react'

import { FarmActionType } from 'views/Stake/types'

export const useStakingModal = () => {
  const [isOpened, setIsOpened] = useState(false)
  const [confirmActionType, setConfirmActionType] =
    useState<null | FarmActionType>(null)

  const open = useCallback((type: FarmActionType) => {
    setConfirmActionType(type)
    setIsOpened(true)
  }, [])

  const close = useCallback(() => {
    setIsOpened(false)
    setTimeout(() => setConfirmActionType(null), 300)
  }, [])

  return { isOpened, type: confirmActionType, open, close }
}
