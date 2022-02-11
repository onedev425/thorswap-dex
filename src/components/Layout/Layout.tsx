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
    <div className="min-h-screen flex flex-col relative flex w-full mx-auto my-0 max-w-8xl">
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
      <div className="flex flex-col md:flex-row flex-1">
        <aside className="bg-fuchsia-100 w-full md:w-60 fixed">
          <Sidebar />
        </aside>
        <main className="flex max-w-[calc(100%-148px)] pl-[148px]">
          {children}
        </main>
      </div>
    </div>
  )
}
