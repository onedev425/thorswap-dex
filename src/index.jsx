import { StrictMode } from 'react'

import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App'

const container = document.getElementById('root')
const root = createRoot(container)

getChainOptions().then((chainOptions) => {
  root.render(
    <WalletProvider {...chainOptions}>
      <StrictMode>
        <App />
      </StrictMode>
    </WalletProvider>,
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
