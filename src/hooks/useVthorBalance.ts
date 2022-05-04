import { useEffect, useState } from 'react'

import { getVthorState } from 'views/StakeVThor/utils'

import { fromWei } from 'services/contract'

export const useVthorBalance = (address?: string) => {
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const getVthorBalance = async () => {
      if (!address) {
        setBalance(0)
        return
      }
      const res = await getVthorState('balanceOf', [address]).catch(() =>
        setBalance(0),
      )
      setBalance(fromWei(res))
    }

    getVthorBalance()
  }, [address])

  return { balance }
}
