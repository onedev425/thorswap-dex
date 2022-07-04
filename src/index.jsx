import { StrictMode } from 'react'

import ReactDOM from 'react-dom'

import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider'

import './index.css'
import App from './App'

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <WalletProvider {...chainOptions}>
      <StrictMode>
        <App />
      </StrictMode>
    </WalletProvider>,
    document.getElementById('root'),
  )
})
