import { useMemo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { ConfirmModal } from 'views/Multisig/components/ConfirmModal'
import { useTxDepositCustom } from 'views/Multisig/TxDepositCustom/hooks'

import { AssetInput } from 'components/AssetInput'
import { Box, Button } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { PanelInput } from 'components/PanelInput'

import { t } from 'services/i18n'

export const TxDepositCustom = () => {
  const {
    isOpenConfirmModal,
    memo,
    assetInput,
    depositAmount,
    handleChangeDepositAmount,
    handleChangeMemo,
    handleCancelConfirm,
    handleCreateTx,
    handleDeposit,
  } = useTxDepositCustom()

  const confirmModalInfo = useMemo(
    () => [
      {
        label: t('common.deposit'),
        value: `${depositAmount?.toSignificant(6)} ${Asset.RUNE().name}`,
      },
      { label: t('common.memo'), value: memo },
    ],
    [memo, depositAmount],
  )

  return (
    <Box className="gap-1" col flex={1}>
      <div className="relative self-stretch md:w-full">
        <AssetInput
          selectedAsset={assetInput}
          onValueChange={handleChangeDepositAmount}
          singleAsset
        />
      </div>

      <PanelInput
        title={t('views.multisig.customMemoLabel')}
        onChange={handleChangeMemo}
        value={memo}
      />

      <Box center className="w-full pt-5">
        <Button isFancy stretch size="lg" onClick={handleDeposit}>
          {t('views.multisig.createTransaction')}
        </Button>
      </Box>

      <ConfirmModal
        inputAssets={[Asset.RUNE()]}
        isOpened={isOpenConfirmModal}
        onConfirm={handleCreateTx}
        onClose={handleCancelConfirm}
      >
        <InfoTable items={confirmModalInfo} />
      </ConfirmModal>
    </Box>
  )
}
