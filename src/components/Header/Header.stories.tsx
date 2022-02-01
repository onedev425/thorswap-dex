import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'

import { Header } from './Header'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Header',
  component: Header,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Header>

const menuItems = [
  { label: 'USDT', value: 'USDT' },
  { label: 'RUNE', value: 'RUNE' },
  { label: 'BTC', value: 'BTC' },
  { label: 'ETH', value: 'ETH' },
]

export const Default = () => {
  const [currency, setCurrency] = useState('USDT')

  return (
    <div className="flex flex-row flex-wrap gap-3 p-4 bg-gray">
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
    </div>
  )
}
