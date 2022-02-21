import { ComponentMeta } from '@storybook/react'

import { Header } from './Header'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Header',
  component: Header,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Header>

export const Default = () => {
  return (
    <div className="flex flex-row flex-wrap gap-3 p-4 bg-gray">
      <Header
        priceLabel="1ᚱ = $ 10.04"
        gweiLabel="156 GWEI"
        connectWallet={() => {}}
        openWalletDrawer={() => {}}
        openMenu={() => {}}
      />
    </div>
  )
}
