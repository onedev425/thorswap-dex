import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { t } from 'services/i18n';
import { useMultisig } from 'store/multisig/hooks';
import { MultisigMember } from 'store/multisig/types';
import { useAppSelector } from 'store/store';

type Props = {
  children: ReactNode;
};

export type TxCreateContextType = {
  signers: MultisigMember[];
  toggleSigner: (val: MultisigMember) => void;
  toggleAllSigners: () => void;
};

const TxCreateContext = createContext<TxCreateContextType>({} as TxCreateContextType);

export const useTxCreate = () => {
  const context = useContext(TxCreateContext);

  if (!context?.signers) {
    throw Error(t('views.multisig.incorrectTxCreateConfig'));
  }

  return context;
};

export const TxCreateProvider = ({ children }: Props) => {
  const { loadBalances } = useMultisig();
  const [signers, setSigners] = useState<MultisigMember[]>([]);
  const { members } = useAppSelector((state) => state.multisig);

  const toggleSigner = useCallback((signer: MultisigMember) => {
    setSigners((v) => {
      const hasSigner = !!v.find((s) => s.pubKey === signer.pubKey);

      if (!hasSigner) {
        return [...v, signer];
      }

      return v.filter((s) => s.pubKey !== signer.pubKey);
    });
  }, []);

  const toggleAllSigners = useCallback(() => {
    setSigners((v) => {
      const allSelected = v.length === members.length;

      return allSelected ? [] : [...members];
    });
  }, [members]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  const value = useMemo(
    () => ({
      signers,
      toggleSigner,
      toggleAllSigners,
    }),
    [signers, toggleAllSigners, toggleSigner],
  );

  return <TxCreateContext.Provider value={value}>{children}</TxCreateContext.Provider>;
};
