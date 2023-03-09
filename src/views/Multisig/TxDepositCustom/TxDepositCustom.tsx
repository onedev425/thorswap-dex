import { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { AssetInput } from 'components/AssetInput';
import { Box, Button } from 'components/Atomic';
import { InfoTable } from 'components/InfoTable';
import { PanelInput } from 'components/PanelInput';
import { shortenAddress } from 'helpers/shortenAddress';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { ConfirmModal } from 'views/Multisig/components/ConfirmModal';
import { useTxDepositCustom } from 'views/Multisig/TxDepositCustom/hooks';

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
  } = useTxDepositCustom();

  const confirmModalInfo = useMemo(
    () => [
      {
        label: t('common.deposit'),
        value: `${depositAmount?.toSignificantWithMaxDecimals(6)} ${Asset.RUNE().name}`,
      },
      { label: t('common.memo'), value: memo.length < 30 ? memo : shortenAddress(memo, 14) },
    ],
    [memo, depositAmount],
  );

  return (
    <Box col className="gap-1" flex={1}>
      <div className="relative self-stretch md:w-full">
        <AssetInput
          singleAsset
          onValueChange={handleChangeDepositAmount}
          selectedAsset={assetInput}
        />
      </div>

      <PanelInput
        onChange={handleChangeMemo}
        title={t('views.multisig.customMemoLabel')}
        value={memo}
      />

      <Box center className="w-full pt-5">
        <Button stretch onClick={handleDeposit} size="lg" variant="fancy">
          {t('views.multisig.createTransaction')}
        </Button>
      </Box>

      <ConfirmModal
        isOpened={isOpenConfirmModal}
        onClose={handleCancelConfirm}
        onConfirm={handleCreateTx}
      >
        <InfoTable items={confirmModalInfo} />
      </ConfirmModal>
    </Box>
  );
};
