import type { Signer } from '@thorswap-lib/toolbox-cosmos';
import { showErrorToast } from 'components/Toast';
import { useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import type { ImportedMultisigTx, MultisigTx } from 'services/multisig';
import { useMultisig } from 'store/multisig/hooks';
import type { MultisigMember } from 'store/multisig/types';
import { useAppSelector } from 'store/store';

export type ScreenState = {
  tx: MultisigTx;
  members: MultisigMember[];
  signatures?: Signer[];
  threshold: number;
};

export const useTxData = (state: ScreenState | null) => {
  const { signTx, broadcastTx, walletPubKey } = useMultisig();
  const { members, threshold } = useAppSelector(({ multisig }) => multisig);
  const txData = useMemo(() => state?.tx || null, [state?.tx]);
  const requiredSigners = useMemo(() => state?.members || [], [state?.members]);

  const [signatures, setSignatures] = useState<Signer[]>(state?.signatures || []);
  const [broadcastedTxHash, setBroadcastedTxHash] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [bodyBytes, setBodyBytes] = useState<number[]>([]);

  const txBodyStr = JSON.stringify(txData, null, 2) || '';
  const canBroadcast = signatures.length >= threshold;

  const connectedSignature = useMemo(() => {
    if (!walletPubKey) {
      return null;
    }

    return signatures.find((s) => s.pubKey === walletPubKey) || null;
  }, [walletPubKey, signatures]);

  const exportTxData: ImportedMultisigTx | null = useMemo(() => {
    if (!txData) {
      return null;
    }

    return {
      txBody: txData,
      members,
      threshold,
      signatures,
      bodyBytes,
    };
  }, [signatures, txData, bodyBytes, members, threshold]);

  const addSigner = useCallback((signer: Signer) => {
    setSignatures((prev) => {
      const idx = prev.findIndex((s) => s.pubKey === signer.pubKey);
      const updated = [...prev];

      if (idx > -1) {
        updated[idx] = signer;
      } else {
        updated.push(signer);
      }

      return updated;
    });
  }, []);

  const sign = useCallback(async () => {
    if (!walletPubKey) {
      return showErrorToast(t('views.multisig.incorrectSigner'));
    }

    const signatureResult = await signTx(JSON.stringify(txData));

    if (signatureResult === undefined) throw Error(`Unable to sign: ${JSON.stringify(txData)}`);

    const { signature, bodyBytes } = signatureResult;
    addSigner({ pubKey: walletPubKey, signature });
    setBodyBytes(Array.from(bodyBytes));
  }, [addSigner, walletPubKey, signTx, txData]);

  // TODO (@0xGeneral) - get recipient and amount from tx
  const txInfo = useMemo(
    () => [
      { label: t('common.amount'), value: 'test amount' },
      { label: t('common.recipient'), value: 'test recipient' },
    ],
    [],
  );

  const handleBroadcast = useCallback(async () => {
    setIsBroadcasting(true);
    const txHash = await broadcastTx(JSON.stringify(txData), signatures, threshold, bodyBytes);
    setIsBroadcasting(false);
    if (txHash) {
      setBroadcastedTxHash(txHash);
      // TODO (@0xGeneral) - Add tx to TxManager
    }
  }, [broadcastTx, signatures, txData, threshold, bodyBytes]);

  const hasMemberSignature = useCallback(
    (signer: MultisigMember) => {
      return !!signatures.find((s) => s.pubKey === signer.pubKey);
    },
    [signatures],
  );

  return {
    txBodyStr,
    txInfo,
    signatures,
    addSigner,
    txData,
    canBroadcast,
    handleBroadcast,
    isBroadcasting,
    broadcastedTxHash,
    requiredSigners,
    hasMemberSignature,
    connectedSignature,
    exportTxData,
    handleSign: sign,
  };
};
