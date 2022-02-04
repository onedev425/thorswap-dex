import { useState } from 'react'

export const useHome = () => {
  const [chainAssetFilterIndex, setChainAssetFilterIndex] = useState(0)
  return {
    chainAssetFilterIndex,
    setChainAssetFilterIndex,
  }
}
