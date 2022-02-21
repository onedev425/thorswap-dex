import { ComponentMeta } from '@storybook/react'

import { ConnectWallet } from './ConnectWallet'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/ConnectWallet',
  component: ConnectWallet,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ConnectWallet>

export const All = () => {
  return <ConnectWallet onChange={(wallet) => console.log(wallet)} />
}
