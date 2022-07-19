import { combineReducers } from '@reduxjs/toolkit'

import { reducer as appReducer } from './app/slice'
import { reducer as assetsReducer } from './assets/slice'
import { reducer as externalConfigReducer } from './externalConfig/slice'
import { reducer as midgardReducer } from './midgard/slice'
import { reducer as multisigReducer } from './multisig/slice'
import { reducer as walletReducer } from './wallet/slice'

const rootReducer = combineReducers({
  app: appReducer,
  assets: assetsReducer,
  midgard: midgardReducer,
  wallet: walletReducer,
  externalConfig: externalConfigReducer,
  multisig: multisigReducer,
})

export default rootReducer
