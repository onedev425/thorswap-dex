import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'

import { Button } from 'components/Atomic'

import { Modal } from './Modal'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Modal',
  component: Modal,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Modal>

export const All = () => {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <div className="flex bg-light-bg-primary dark:bg-dark-bg-primary px-10 py-80">
      <div className="p-5">
        <Button onClick={() => setIsOpened((visible) => !visible)}>
          Open modal
        </Button>
      </div>

      <Modal
        title="Modal title"
        isOpened={isOpened}
        onClose={() => setIsOpened(false)}
      >
        <div>
          <Button onClick={() => setIsOpened(false)}>Close modal</Button>
        </div>
      </Modal>
    </div>
  )
}
