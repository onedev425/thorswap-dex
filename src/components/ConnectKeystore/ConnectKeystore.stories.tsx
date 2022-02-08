import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'

import { Button } from 'components/Button'
import { TooltipPortal } from 'components/Tooltip'

import { ConnectKeystore } from './ConnectKeystore'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/ConnectKeystore',
  component: ConnectKeystore,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ConnectKeystore>

export const All = () => {
  const [file, setFile] = useState<null | File>(null)
  const [password, setPassword] = useState('')
  const [isOpened, setIsOpened] = useState(false)

  const handleFile = (event: React.ChangeEvent) => {
    const fileUploaded = (event.target as HTMLInputElement)?.files
    alert('file selected')
    if (fileUploaded) {
      setFile(fileUploaded[0])
    }
  }

  const handlePassword = (event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement)?.value
    console.log(value, 'value')
    setPassword(value)
  }

  const unlock = () => {
    alert('unlocked')
  }

  const createWallet = () => {
    alert('create wallet')
  }

  return (
    <div className="bg-light-bg-primary dark:bg-dark-bg-primary px-10 py-80">
      <TooltipPortal />

      <Button onClick={() => setIsOpened(true)}>Open Keystore modal</Button>
      <ConnectKeystore
        onClose={() => setIsOpened(false)}
        isOpened={isOpened}
        fileName={file?.name}
        password={password}
        onFileUpload={handleFile}
        onPasswordChange={handlePassword}
        onUnlock={unlock}
        onCreateWallet={createWallet}
      />
    </div>
  )
}
