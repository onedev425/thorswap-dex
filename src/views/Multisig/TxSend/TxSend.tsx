import { Asset } from '@thorswap-lib/multichain-core';
import { AssetInput } from 'components/AssetInput';
import { Box, Button } from 'components/Atomic';
import { InfoTable } from 'components/InfoTable';
import { PanelInput } from 'components/PanelInput';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { ConfirmModal } from 'views/Multisig/components/ConfirmModal';
import { useTxSend } from 'views/Multisig/TxSend/hooks';

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
  } = useTxSend();

  const confirmModalInfo = useMemo(
    () => [
      {
        label: t('common.send'),
        value: `${sendAmount?.toSignificant(6)} ${sendAsset.name}`,
      },
      { label: t('common.recipient'), value: recipientAddress },
    ],
    [recipientAddress, sendAmount, sendAsset.name],
  );

  return (
    <Box col className="gap-1" flex={1}>
      <div className="relative self-stretch md:w-full">
        <AssetInput
          assets={assetInputList}
          onAssetChange={handleSelectAsset}
          onValueChange={handleChangeSendAmount}
          selectedAsset={assetInput}
        />
      </div>

      <PanelInput
        onChange={handleChangeRecipient}
        placeholder={`${
          assetInput.asset.isSynth ? Asset.RUNE().network : assetInput.asset.network
        } ${t('common.address')}`}
        title={t('common.recipientAddress')}
        value={recipientAddress}
      />

      <PanelInput collapsible onChange={handleChangeMemo} title={t('common.memo')} value={memo} />

      <Box center className="w-full pt-5">
        <Button isFancy stretch onClick={handleSend} size="lg">
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
