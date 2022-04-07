import { useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetSelectButton } from 'components/AssetSelect/AssetSelectButton'
import { AssetSelectList } from 'components/AssetSelect/AssetSelectList'
import { AssetSelectProps } from 'components/AssetSelect/types'
import { Modal } from 'components/Atomic'

import { t } from 'services/i18n'

type Props = {
  selected?: Asset | null
  className?: string
  showAssetType?: boolean
} & AssetSelectProps

export const AssetSelect = ({
  selected,
  className,
  showAssetType,
  ...restProps
}: Props) => {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <>
      <AssetSelectButton
        className={className}
        selected={selected}
        onClick={() => setIsOpened(true)}
        showAssetType={showAssetType}
      />

      <Modal
        title={t('components.assetSelect.selectAToken')}
        isOpened={isOpened}
        onClose={() => setIsOpened(false)}
        withBody={false}
      >
        <div className="flex flex-1 w-[90vw] md:w-[520px] overflow-hidden max-h-[80%] h-[80vh] lg:h-[40rem]">
          <AssetSelectList {...restProps} onClose={() => setIsOpened(false)} />
        </div>
      </Modal>
    </>
  )
}
