import { useCallback, useEffect, useRef, useState } from 'react'

import { THORNameDetails } from '@thorswap-lib/multichain-sdk'

import { useAppSelector } from 'store/store'

import { getAddressThornames, getThornameDetails } from 'services/thorname'

export const useFetchThornames = () => {
  const fetching = useRef(false)
  const [registeredThornames, setRegisteredThornames] = useState<
    null | (THORNameDetails & { thorname: string })[]
  >(null)

  const thorAddress = useAppSelector(
    ({ wallet }) => wallet?.wallet?.THOR?.address,
  )

  const fetchRegisteredThornames = useCallback(async () => {
    if (!thorAddress || fetching.current) return
    fetching.current = true

    const thornames = await getAddressThornames(thorAddress)
    const thornamesDetails = await Promise.all(
      thornames.map(async (name) => ({
        ...(await getThornameDetails(name)),
        thorname: name,
      })),
    )

    setRegisteredThornames(thornamesDetails)
  }, [setRegisteredThornames, thorAddress])

  useEffect(() => {
    if (thorAddress && !registeredThornames) {
      fetchRegisteredThornames()
    } else if (!thorAddress && registeredThornames) {
      setRegisteredThornames(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thorAddress])

  return registeredThornames
}
