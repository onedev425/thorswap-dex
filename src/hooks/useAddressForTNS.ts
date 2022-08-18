import { useCallback, useEffect, useState } from 'react'

import { THORName, THORNameDetails } from '@thorswap-lib/multichain-sdk'

import { useDebouncedValue } from 'hooks/useDebounceValue'

import { getThornameDetails } from 'services/thorname'

export const useAddressForTNS = (address: string) => {
  const debouncedAddress = useDebouncedValue(address, 1200)
  const [loading, setLoading] = useState(false)
  const [TNS, setTNS] =
    useState<Maybe<THORNameDetails & { thorname: string }>>(null)

  const lookupForTNS = useCallback(
    async (providedThorname: string) => {
      try {
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
    const [possibleThorname] = debouncedAddress.toLowerCase().split('.')

    if (THORName.isValidName(possibleThorname)) {
      getThornameDetails(possibleThorname)
        .then((details) => {
          setTNS({ ...details, thorname: possibleThorname })
        })
        .catch(() => setTNS(null))
        .finally(() => setLoading(false))

      lookupForTNS(possibleThorname.toLowerCase())
    }
  }, [debouncedAddress, lookupForTNS])

  useEffect(() => {
    if (THORName.isValidName(address)) {
      setLoading(true)
    }
  }, [address])

  return { loading, TNS, setTNS }
}
