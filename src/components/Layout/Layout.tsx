import { useState } from 'react'

import { Header } from 'components/Header'
import { Sidebar } from 'components/Sidebar'

export type LayoutProp = {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProp) => {
  const menuItems = [
    { label: 'USDT', value: 'USDT' },
    { label: 'RUNE', value: 'RUNE' },
    { label: 'BTC', value: 'BTC' },
    { label: 'ETH', value: 'ETH' },
  ]

  const [currency, setCurrency] = useState('USDT')

  return (
    <div className="relative flex w-full mx-auto my-0 max-w-8xl">
      <Sidebar />
      <div className="w-full max-w-[calc(100%-92px)] relative p-5 xl:px-10 2xl:px-20 2xl:py-10">
        <Header
          currencyOptions={menuItems}
          currency={currency}
          selectCurrency={setCurrency}
          priceLabel="1ᚱ = $ 10.04"
          gweiLabel="156 GWEI"
          connectWallet={() => {}}
          openDrawer={() => {}}
          refresh={() => {}}
        />
        {children}
      </div>
    </div>
  )
}
