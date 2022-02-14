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
    <div className="relative flex flex-col w-full min-h-screen mx-auto my-0 max-w-8xl">
      <div className="flex flex-col flex-1">
        <aside className="fixed bg-fuchsia-100">
          <Sidebar />
        </aside>
        <main className="flex flex-col ml-[92px] max-w-[calc(100%-148px)] px-10 py-5 dark:bg-elliptical">
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
        </main>
      </div>
    </div>
  )
}
