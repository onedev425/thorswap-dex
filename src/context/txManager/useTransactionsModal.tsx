import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTransactionsState } from "store/transactions/hooks";
import type { CompletedTransactionType, PendingTransactionType } from "store/transactions/types";
import { findTxIndexById } from "store/transactions/utils";

type WalletDrawerContextType = {
  isOpened: boolean;
  selectedTxId: string;
  selectedTx: PendingTransactionType | CompletedTransactionType | null;
  setSelectedTxId: (txid: string) => void;
  close: () => void;
  next: () => void;
  previous: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  open: (txid?: string) => void;
  selectedIndex: number | null;
  allCount: number;
};

export const TransactionsModalContext = createContext({
  isOpened: false,
  setIsDrawerVisible: (_: boolean) => undefined,
  close: () => undefined,
  open: () => undefined,
  selectedTxId: "",
  setSelectedTxId: (_: string) => undefined,
  selectedTx: null,
  next: () => undefined,
  previous: () => undefined,
  hasNext: false,
  hasPrev: false,
  selectedIndex: null,
  allCount: 0,
} as WalletDrawerContextType);

type Props = {
  children?: ReactNode;
};

export const TransactionsModalProvider = ({ children }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const { advancedTracking: transactions } = useTransactionsState();
  const [selectedTxId, setSelectedTxId] = useState("");
  const [selectedTx, setSelectedTx] = useState<
    PendingTransactionType | CompletedTransactionType | null
  >(null);
  const selectedIndex = useMemo(() => {
    return selectedTxId ? findTxIndexById(transactions, selectedTxId) : null;
  }, [selectedTxId, transactions]);
  const hasNext = selectedIndex !== null && selectedIndex < transactions.length - 1;
  const hasPrev = selectedIndex !== null && selectedIndex > 0;

  useEffect(() => {
    const idx = findTxIndexById(transactions, selectedTxId);
    if (idx === -1) {
      const firstTx = transactions[0];
      setSelectedTxId(firstTx?.txid || "");
      return setSelectedTx(firstTx || null);
    }

    return setSelectedTx(transactions[idx]);
  }, [selectedTxId, transactions]);

  useEffect(() => {
    if (!transactions.length) {
      setSelectedTxId("");
      setSelectedTx(null);
      setIsOpened(false);
    }
  }, [transactions.length]);

  useEffect(() => {
    document.body.style.overflow = isOpened ? "hidden" : "unset";
  }, [isOpened]);

  const open = useCallback((txId?: string) => {
    setIsOpened(true);
    setSelectedTxId(txId || "");
  }, []);

  const close = useCallback(() => {
    setIsOpened(false);
  }, []);

  const next = useCallback(() => {
    if (hasNext) {
      const nextTx = transactions[selectedIndex + 1];
      setSelectedTxId(nextTx?.txid || "");
    }
  }, [hasNext, selectedIndex, transactions]);

  const previous = useCallback(() => {
    if (hasPrev) {
      const prevTx = transactions[selectedIndex - 1];
      setSelectedTxId(prevTx?.txid || "");
    }
  }, [hasPrev, selectedIndex, transactions]);

  return (
    <TransactionsModalContext.Provider
      value={{
        isOpened,
        open,
        close,
        selectedTx,
        selectedTxId,
        setSelectedTxId,
        next,
        previous,
        hasNext,
        hasPrev,
        selectedIndex,
        allCount: transactions.length,
      }}
    >
      {children}
    </TransactionsModalContext.Provider>
  );
};

export const useTransactionsModal = () => {
  return useContext(TransactionsModalContext);
};
