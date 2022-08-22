import { useEffect, useState } from 'react'

import { useGetTokenListQuery } from 'store/static/api'
import { Token } from 'store/thorswap/types'

export const useThorchainErc20Supported = () => {
  const [thorchainErc20Supported, setThorchainErc20Supported] = useState<
    Token[]
  >([])

  const { data } = useGetTokenListQuery('Thorchain-supported-ERC20')

  useEffect(() => {
    if (data?.tokens?.length) {
      setThorchainErc20Supported(data.tokens)
    }
  }, [data?.tokens])

  return thorchainErc20Supported
}
