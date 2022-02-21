import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'

import { AssetTickerType } from 'components/AssetIcon/types'

import { ChainList } from '../types'
import { SelectChain } from './SelectChain'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/SelectChain',
  component: SelectChain,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof SelectChain>

export const Simple = () => {
  const [isOpened, setIsOpened] = useState(true)
  const [chainList, setChainList] = useState(ChainList)

  const handleChainSelected = (chain: AssetTickerType) => {
    const updatedChainList = [...chainList]
    updatedChainList.map((item) => {
      if (item.name === chain) {
        item.isConnected = !item.isConnected
      }
    })
    setChainList(updatedChainList)
  }

  const handleConnect = () => {
    console.log(chainList)
  }

  return (
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <div className="flex space-x-2 flex-col items-start gap-3">
        <SelectChain
          isOpened={isOpened}
          handleConnect={handleConnect}
          chainList={chainList}
          handleChainSelected={handleChainSelected}
          handleClose={() => setIsOpened(false)}
        />
      </div>
    </div>
  )
}
