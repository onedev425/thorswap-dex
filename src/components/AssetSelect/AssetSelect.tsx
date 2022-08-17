import { useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetSelectButton } from 'components/AssetSelect/AssetSelectButton'
import { AssetSelectList } from 'components/AssetSelect/AssetSelectList'
import { TokenListProviderSelect } from 'components/AssetSelect/TokenListProviderSelect'
import { AssetSelectProps } from 'components/AssetSelect/types'
import { Box, Modal } from 'components/Atomic'

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
  const [manageTokenListIsOpened, setManageTokenListIsOpened] = useState(false)

  return (
    <>
      <AssetSelectButton
        className={className}
        selected={selected}
        onClick={() => {
          setIsOpened(true)
          setManageTokenListIsOpened(false)
        }}
        showAssetType={showAssetType}
      />

      <Modal
        title={t(
          manageTokenListIsOpened
            ? 'components.assetSelect.manageTokenList'
            : 'components.assetSelect.selectAToken',
        )}
        isOpened={isOpened}
        onClose={() => setIsOpened(false)}
        withBody={false}
        onBack={
          manageTokenListIsOpened
            ? () => setManageTokenListIsOpened(false)
            : undefined
        }
      >
        <Box className="w-[95vw] md:w-[520px] overflow-hidden max-h-[80%] h-[80vh] lg:h-[40rem]">
          {manageTokenListIsOpened ? (
            <TokenListProviderSelect {...restProps} />
          ) : (
            <AssetSelectList
              {...restProps}
              onClose={() => setIsOpened(false)}
              openManageTokenList={() => setManageTokenListIsOpened(true)}
            />
          )}
        </Box>
      </Modal>
    </>
  )
}
