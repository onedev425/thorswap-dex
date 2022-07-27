import { useMemo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { ConfirmModal } from 'views/Multisig/components/ConfirmModal'
import { useTxSend } from 'views/Multisig/TxSend/hooks'

import { AssetInput } from 'components/AssetInput'
import { Box, Button } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { PanelInput } from 'components/PanelInput'

import { t } from 'services/i18n'

export const TxSend = () => {
  const {
    assetInputList,
    memo,
    recipientAddress,
    assetInput,
    sendAsset,
    sendAmount,
    handleSelectAsset,
    handleChangeSendAmount,
    handleChangeRecipient,
    handleChangeMemo,
    isOpenConfirmModal,
    handleCancelConfirm,
    handleCreateTx,
    handleSend,
  } = useTxSend()

  const confirmModalInfo = useMemo(
    () => [
      {
        label: t('common.send'),
        value: `${sendAmount?.toSignificant(6)} ${sendAsset.name}`,
      },
      { label: t('common.recipient'), value: recipientAddress },
    ],
    [recipientAddress, sendAmount, sendAsset.name],
  )

  return (
    <Box className="gap-1" col flex={1}>
      <div className="relative self-stretch md:w-full">
        <AssetInput
          selectedAsset={assetInput}
          assets={assetInputList}
          commonAssets={[]}
          onAssetChange={handleSelectAsset}
          onValueChange={handleChangeSendAmount}
        />
      </div>

      <PanelInput
        title={t('common.recipientAddress')}
        placeholder={`${
          assetInput.asset.isSynth
            ? Asset.RUNE().network
            : assetInput.asset.network
        } ${t('common.address')}`}
        onChange={handleChangeRecipient}
        value={recipientAddress}
      />

      <PanelInput
        collapsible
        title={t('common.memo')}
        onChange={handleChangeMemo}
        value={memo}
      />

      <Box center className="w-full pt-5">
        <Button isFancy stretch size="lg" onClick={handleSend}>
          {t('views.multisig.createTransaction')}
        </Button>
      </Box>

      <ConfirmModal
        inputAssets={[sendAsset]}
        isOpened={isOpenConfirmModal}
        onConfirm={handleCreateTx}
        onClose={handleCancelConfirm}
      >
        <InfoTable items={confirmModalInfo} />
      </ConfirmModal>
    </Box>
  )
}
