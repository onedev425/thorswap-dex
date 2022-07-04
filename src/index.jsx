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

if (import.meta.env.DEV) {
  // Learn more: https://bit.ly/CRA-vitals
  import('./reportWebVitals').then(({ default: reportWebVitals }) => {
    reportWebVitals(console.info)
  })
}
