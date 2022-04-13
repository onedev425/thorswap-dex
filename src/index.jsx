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
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  import('./reportWebVitals').then(({ default: reportWebVitals }) => {
    reportWebVitals(console.log)
  })
}
