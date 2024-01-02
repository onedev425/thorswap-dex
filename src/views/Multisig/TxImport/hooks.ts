import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import type { ImportedMultisigTx } from 'services/multisig';
import { ROUTES } from 'settings/router';

export const useTxImportForm = () => {
  const [fileError, setFileError] = useState('');
  const [importedTx, setImportedTx] = useState<ImportedMultisigTx | null>(null);
  const navigate = useNavigate();

  const parseData = useCallback(async (data: ImportedMultisigTx) => {
    const tx = data.txBody;

    if (!tx) {
      throw Error(t('views.multisig.invalidTxBody'));
    }

    if (
      !data.members ||
      !Array.isArray(data.members) ||
      data.members.length < data.threshold ||
      data.members.some((m) => !m.pubKey)
    ) {
      throw Error(t('views.multisig.incorrectSigners'));
    }

    if (
      data.signatures &&
      (!Array.isArray(data.signatures) || data.signatures.some((s) => !s.pubKey))
    ) {
      throw Error(t('views.multisig.invalidSignatures'));
    }

    const parsedData: ImportedMultisigTx = {
      threshold: data.threshold,
      txBody: data.txBody,
      bodyBytes: data.bodyBytes,
      members: data.members.map((m) => ({
        pubKey: m.pubKey,
        name: m.name || '',
      })),
      signatures: data.signatures
        .map((m) => ({
          pubKey: m.pubKey,
          signature: m.signature || '',
        }))
        .filter((s) => s.signature),
    };

    return parsedData;
  }, []);

  const onChangeFile = useCallback(
    async (fileContent: string) => {
      try {
        setFileError('');
        const rawData = JSON.parse(fileContent);
        const data = await parseData(rawData);

        setImportedTx(data);
      } catch (error: NotWorth) {
        console.error(error);
        setFileError(t('views.multisig.jsonError'));
        setImportedTx(null);
      }
    },
    [parseData],
  );

  const onError = useCallback((errorName: string) => {
    setFileError(`${t('views.multisig.selectingKeyError')}: ${errorName}`);
    setImportedTx(null);
  }, []);

  const handleImportTx = useCallback(() => {
    if (!importedTx) {
      return;
    }

    const { txBody, signatures, members, threshold, bodyBytes } = importedTx;
    navigate(ROUTES.TxMultisig, {
      state: { tx: txBody, members, threshold, signatures, bodyBytes },
    });
  }, [importedTx, navigate]);

  return {
    onChangeFile,
    fileError,
    setFileError,
    onError,
    useCallback,
    handleImportTx,
    isValid: !!importedTx && !fileError,
    importedTx,
  };
};
