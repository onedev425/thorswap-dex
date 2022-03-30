import { useEffect, useState } from 'react'

import { BNBChain } from '@thorswap-lib/xchain-util'

import { multichain } from 'services/multichain'

const checkIfExchangeBNBAddress = async (address: string) => {
  // validate address
  if (!multichain.validateAddress({ address, chain: BNBChain })) {
    return false
  }

  try {
    const response = await multichain.bnb
      .getClient()
      .getBncClient()
      .getAccount(address)
    console.log('getting response', response)

    // if flags === 0, it's not exchange address

    if (response && response?.result?.flags !== 0) {
      return true
    }
    return false
  } catch (error) {
    console.log('getting error bnb account')
    return false
  }
}

// used for checking if BNB address is an exchange address
export const useCheckExchangeBNB = (address: string | null) => {
  const [isExchangeBNBAddress, setIsExchangeBNBAddress] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const checkFunc = async () => {
      if (address) {
        const isExchangeAddress = await checkIfExchangeBNBAddress(address)
        setIsExchangeBNBAddress(isExchangeAddress)
      }
    }

    checkFunc()
  }, [address])

  return {
    isExchangeBNBAddress,
  }
}
