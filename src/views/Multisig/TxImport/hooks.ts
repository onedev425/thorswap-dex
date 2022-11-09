import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { ImportedMultisigTx } from 'services/multisig';
import { ROUTES } from 'settings/router';
import { useMultisig } from 'store/multisig/hooks';
import { useAppSelector } from 'store/store';

export const useTxImportForm = () => {
  const [fileError, setFileError] = useState('');
  const [importedTx, setImportedTx] = useState<ImportedMultisigTx | null>(null);
  const { importTx } = useMultisig();
  const navigate = useNavigate();
  const { treshold } = useAppSelector((state) => state.multisig);

  const parseData = useCallback(
    async (data: ImportedMultisigTx) => {
      const tx = await importTx(JSON.stringify(data.txBody));

      if (!tx) {
        throw Error(t('views.multisig.invalidTxBody'));
      }

      if (
        !data.signers ||
        !Array.isArray(data.signers) ||
        data.signers.length < treshold ||
        data.signers.some((s) => !s.pubKey)
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
        txBody: data.txBody,
        signers: data.signers.map((m) => ({
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
    },
    [importTx, treshold],
  );

  const onChangeFile = useCallback(
    (file: Blob) => {
      const reader = new FileReader();
      const onLoadHandler = async () => {
        try {
          setFileError('');
          const rawData = JSON.parse(reader.result as string);
          const data = await parseData(rawData);

          setImportedTx(data);
        } catch (e: ErrorType) {
          setFileError(t('views.multisig.jsonError'));
          setImportedTx(null);
        }
      };

      reader.addEventListener('load', onLoadHandler);
      reader.readAsText(file);
      return () => {
        reader.removeEventListener('load', onLoadHandler);
      };
    },
    [parseData],
  );

  const onError = useCallback((error: Error) => {
    setFileError(`${t('views.multisig.selectingKeyError')}: ${error}`);
    setImportedTx(null);
  }, []);

  const handleImportTx = useCallback(() => {
    if (!importedTx) {
      return;
    }

    const { txBody, signatures, signers } = importedTx;
    navigate(ROUTES.TxMultisig, {
      state: { tx: txBody, signers, signatures },
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
