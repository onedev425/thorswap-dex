import { createAsyncThunk } from '@reduxjs/toolkit'

import { multisig } from 'services/multisig'

export const loadMultisigBalances = createAsyncThunk(
  'multisig/loadMultisigBalances',
  async () => {
    return multisig.loadMultisigBalances()
  },
)
