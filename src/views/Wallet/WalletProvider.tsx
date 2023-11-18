import { createContext, memo, useContext, useMemo, useReducer } from 'react';
import { emptyWallet } from 'views/Wallet/hooks';

type Dispatch = (action: Action) => void;
type ProviderProps = { children: React.ReactNode };
type Action = { type: 'setWallet'; payload: Wallet };
type Wallet = typeof emptyWallet;

const AppStateContext = createContext<Wallet | undefined>(undefined);
const AppUpdaterContext = createContext<Dispatch | undefined>(undefined);

const appReducer = (state: Wallet, action: Action) => {
  switch (action.type) {
    case 'setWallet': {
      return action.payload;
    }

    default: {
      return state;
    }
  }
};

const Provider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(appReducer, emptyWallet);

  return (
    <AppStateContext.Provider value={state}>
      <AppUpdaterContext.Provider value={dispatch}>{children}</AppUpdaterContext.Provider>
    </AppStateContext.Provider>
  );
};

export const WalletProvider = memo(Provider);

export const useAppWallet = () => {
  const appState = useContext(AppStateContext);
  if (typeof appState === 'undefined') {
    throw new Error('useAppState must be used within a AppProvider');
  }
  return appState;
};

export const useWalletDispatch = () => {
  const appDispatch = useContext(AppUpdaterContext);
  if (typeof appDispatch === 'undefined') {
    throw new Error('useAppDispatch must be used within a AppProvider');
  }

  return appDispatch;
};

export const useWalletContext = () => {
  const walletState = useAppWallet();
  const walletDispatch = useWalletDispatch();

  const appContext: [Wallet, Dispatch] = useMemo(
    () => [walletState, walletDispatch],
    [walletState, walletDispatch],
  );

  return appContext;
};
