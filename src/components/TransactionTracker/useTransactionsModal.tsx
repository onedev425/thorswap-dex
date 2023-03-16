import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useTransactionsState } from 'store/transactions/hooks';
import { CompletedTransactionType, PendingTransactionType } from 'store/transactions/types';
import { findTxIndexById } from 'store/transactions/utils';

type WalletDrawerContextType = {
  isOpened: boolean;
  selectedTxId: string;
  selectedTx: PendingTransactionType | CompletedTransactionType | null;
  setSelectedTxId: (txid: string) => void;
  close: () => void;
  open: (txid?: string) => void;
};

export const TransactionsModalContext = createContext({
  isOpened: false,
  setIsDrawerVisible: (_: boolean) => {},
  close: () => {},
  open: () => {},
  selectedTxId: '',
  setSelectedTxId: (_: string) => {},
  selectedTx: null,
} as WalletDrawerContextType);

type Props = {
  children?: ReactNode;
};

export const TransactionsModalProvider = ({ children }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const { transactions } = useTransactionsState();
  const [selectedTxId, setSelectedTxId] = useState('');
  const [selectedTx, setSelectedTx] = useState<
    PendingTransactionType | CompletedTransactionType | null
  >(null);

  useEffect(() => {
    const idx = findTxIndexById(transactions, selectedTxId);
    if (idx === -1) {
      const firstTx = transactions[0];
      setSelectedTxId(firstTx?.txid || '');
      return setSelectedTx(firstTx || null);
    }

    return setSelectedTx(transactions[idx]);
  }, [selectedTxId, transactions]);

  useEffect(() => {
    if (!transactions.length) {
      setSelectedTxId('');
      setSelectedTx(null);
      setIsOpened(false);
    }
  }, [transactions.length]);

  useEffect(() => {
    document.body.style.overflow = isOpened ? 'hidden' : 'unset';
  }, [isOpened]);

  const open = useCallback((txId?: string) => {
    setIsOpened(true);
    setSelectedTxId(txId || '');
  }, []);

  const close = useCallback(() => {
    setIsOpened(false);
  }, []);

  return (
    <TransactionsModalContext.Provider
      value={{ isOpened, open, close, selectedTx, selectedTxId, setSelectedTxId }}
    >
      {children}
    </TransactionsModalContext.Provider>
  );
};

export const useTransactionsModal = () => {
  return useContext(TransactionsModalContext);
};
