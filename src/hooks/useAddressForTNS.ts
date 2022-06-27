import { useCallback, useEffect, useState } from 'react'

import { THORName, THORNameDetails } from '@thorswap-lib/multichain-sdk'

import { useDebouncedValue } from 'hooks/useDebounceValue'

import { getThornameDetails } from 'services/thorname'

export const useAddressForTNS = (address: string) => {
  const debouncedAddress = useDebouncedValue(address, 500)
  const [loading, setLoading] = useState(false)
  const [TNS, setTNS] =
    useState<Maybe<THORNameDetails & { thorname: string }>>(null)

  const lookupForTNS = useCallback(
    async (providedThorname: string) => {
      try {
        setLoading(true)

        const details = await getThornameDetails(providedThorname)

        setTNS({ ...details, thorname: providedThorname })
      } catch {
        setTNS(null)
      } finally {
        setLoading(false)
      }
    },
    [setTNS],
  )

  useEffect(() => {
    const [possibleThorname] = debouncedAddress.split('.')

    if (THORName.isValidName(possibleThorname)) {
      lookupForTNS(possibleThorname.toLowerCase())
    }
  }, [debouncedAddress, lookupForTNS])

  return { loading, TNS }
}
