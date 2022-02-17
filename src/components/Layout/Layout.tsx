import { ReactNode, useState } from 'react'

import { Scrollbars } from 'react-custom-scrollbars'

import classNames from 'classnames'

import { Header } from 'components/Header'
import { Sidebar } from 'components/Sidebar'

import { useToggle } from '../../hooks/useDrawer'

export type LayoutProp = {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProp) => {
  const [onOff, setOnOff] = useToggle()

  const menuItems = [
    { label: 'USDT', value: 'USDT' },
    { label: 'RUNE', value: 'RUNE' },
    { label: 'BTC', value: 'BTC' },
    { label: 'ETH', value: 'ETH' },
  ]

  const [currency, setCurrency] = useState('USDT')

  const connectWallet = () => {
    setOnOff()
  }

  return (
    <Scrollbars
      autoHide
      renderThumbVertical={({ style, ...scrollProps }) => (
        <div
          style={{ ...style, backgroundColor: '#00d2ff', width: '4px' }}
          {...scrollProps}
        />
      )}
      style={{ height: '100vh' }}
    >
      <div className="relative flex flex-col w-full min-h-screen mx-auto my-0 max-w-8xl">
        <aside className="fixed hidden bg-fuchsia-100 md:block">
          <Sidebar />
        </aside>
        <main
          className={classNames(
            'flex flex-col ml-0 md:ml-[92px] md:max-w-[calc(100%-148px)] px-3 md:px-10 py-5 dark:bg-elliptical',
            { 'blur-md pointer-events-none': onOff },
          )}
        >
          <Header
            currencyOptions={menuItems}
            currency={currency}
            selectCurrency={setCurrency}
            priceLabel="1ᚱ = $ 10.04"
            gweiLabel="156 GWEI"
            connectWallet={() => {}}
            openDrawer={connectWallet}
            refresh={() => {}}
          />
          {children}
        </main>
      </div>
    </Scrollbars>
  )
}
