import { showErrorToast } from 'components/Toast';
import { useCallback, useState } from 'react';
import { t } from 'services/i18n';
import { multisig } from 'services/multisig';
import { useMultisig } from 'store/multisig/hooks';
import type { MultisigMember } from 'store/multisig/types';

type WalletData = {
  treshold?: number; // backward compatiiblity with old wallets
  threshold: number;
  members: MultisigMember[];
};

type Props = {
  onSuccess: () => void;
};

export const useMultisigImport = ({ onSuccess }: Props) => {
  const [fileError, setFileError] = useState('');
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [name, setName] = useState('');
  const { addMultisigWallet } = useMultisig();

  const parseData = useCallback((data: WalletData) => {
    if (!data.members || !Array.isArray(data.members) || data.members.some((m) => !m.pubKey)) {
      throw Error('Incorrect wallet members');
    }

    const threshold = Number(data.threshold) || Number(data.treshold);
    if (!threshold || threshold > data.members.length) {
      throw Error('Incorrect threshold');
    }

    const parsedData: WalletData = {
      threshold,
      members: data.members.map(({ pubKey, name = '' }) => ({ pubKey, name })),
    };

    return parsedData;
  }, []);

  const onChangeFile = useCallback(
    (fileContent: string) => {
      try {
        const rawData = JSON.parse(fileContent as string);
        const data = parseData(rawData);
        setFileError('');
        setWalletData(data);
      } catch (error: NotWorth) {
        console.error(error);
        setFileError(t('views.multisig.jsonError'));
        setWalletData(null);
      }
    },
    [parseData],
  );

  const onError = useCallback((errorName: string) => {
    if (!errorName) return;

    setFileError(`${t('views.multisig.selectingKeyError')}: ${errorName}`);
    setWalletData(null);
  }, []);

  const handleConnectWallet = useCallback(async () => {
    if (!walletData) {
      return;
    }

    try {
      const { members, threshold } = walletData;
      const address = await multisig.createMultisigWallet(members, threshold);

      if (!address) {
        throw Error('Incorrect wallet data');
      }

      addMultisigWallet({ members, threshold, address, name });
      onSuccess();
    } catch (error: NotWorth) {
      console.error(error);
      showErrorToast('');
    }
  }, [addMultisigWallet, name, onSuccess, walletData]);

  return {
    onChangeFile,
    fileError,
    setFileError,
    onError,
    name,
    setName,
    useCallback,
    handleConnectWallet,
    isValid: !!walletData && !fileError,
    walletData,
  };
};
