import { createAsyncThunk } from '@reduxjs/toolkit'
import { SupportedChain } from '@thorswap-lib/multichain-sdk'

import { multichain } from 'services/multichain'

export const loadAllWallets = createAsyncThunk(
  'midgard/loadAllWallets',
  multichain.loadAllWallets,
)

export const getWalletByChain = createAsyncThunk(
  'midgard/getWalletByChain',
  async (chain: SupportedChain) => {
    const data = await multichain.getWalletByChain(chain)

    return {
      chain,
      data,
    }
  },
)
