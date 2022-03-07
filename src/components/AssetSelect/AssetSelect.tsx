import { useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetSelectButton } from 'components/AssetSelect/AssetSelectButton'
import { AssetSelectList } from 'components/AssetSelect/AssetSelectList'
import { AssetSelectProps } from 'components/AssetSelect/types'
import { Modal } from 'components/Atomic'

type Props = {
  selected?: Asset | null
  className?: string
} & AssetSelectProps

export const AssetSelect = ({ selected, className, ...restProps }: Props) => {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <>
      <AssetSelectButton
        className={className}
        selected={selected}
        onClick={() => setIsOpened(true)}
      />

      <Modal
        title="Select a token"
        isOpened={isOpened}
        onClose={() => setIsOpened(false)}
        withBody={false}
      >
        <div className="flex flex-1 lg:w-[520px] overflow-hidden max-h-[80%] h-[80vh] lg:h-[40rem]">
          <AssetSelectList {...restProps} onClose={() => setIsOpened(false)} />
        </div>
      </Modal>
    </>
  )
}
