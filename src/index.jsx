import { StrictMode } from 'react'

import ReactDOM from 'react-dom'

import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import './index.css'
import App from './App'
import { checkOrigin } from './helpers/checkOrigin'

dayjs.extend(duration)

getChainOptions().then((chainOptions) => {
  if (!checkOrigin()) return

  ReactDOM.render(
    <WalletProvider {...chainOptions}>
      <StrictMode>
        <App />
      </StrictMode>
    </WalletProvider>,
    document.getElementById('root'),
  )
})
