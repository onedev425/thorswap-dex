import { useState } from 'react'

import { BrowserRouter } from 'react-router-dom'

import { ComponentMeta } from '@storybook/react'

import { InfoTip } from './InfoTip'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/InfoTip',
  component: InfoTip,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof InfoTip>

export const Default = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <BrowserRouter>
      <div className="flex flex-col flex-wrap gap-3 p-4 bg-gray">
        {isOpen && (
          <InfoTip
            title="Info tip title."
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque porta libero risus. Praesent non cursus nibh, nec porta quam. Mauris ut mauris laoreet, faucibus tortor bibendum, dignissim urna."
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    </BrowserRouter>
  )
}
