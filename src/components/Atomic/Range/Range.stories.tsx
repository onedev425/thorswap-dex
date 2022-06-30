import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'
import { Amount } from '@thorswap-lib/multichain-sdk'

import { ThemeProvider } from 'components/Theme/ThemeContext'

import { Range as RangeComp } from './index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Range',
  component: RangeComp,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof RangeComp>

export const Range = () => {
  const [range, setRange] = useState<Amount>(Amount.fromNormalAmount(0))

  const handleRange = (value: Amount) => {
    setRange(value)
  }

  return (
    <ThemeProvider>
      <RangeComp onAmountChange={handleRange} amountValue={range} />
    </ThemeProvider>
  )
}
