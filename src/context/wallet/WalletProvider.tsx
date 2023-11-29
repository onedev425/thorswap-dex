import type { AssetValue, ChainWallet } from '@swapkit/core';
import { Chain } from '@swapkit/core';
import type { Keystore } from '@swapkit/wallet-keystore';
import { getFromStorage, saveInStorage } from 'helpers/storage';
import { createContext, memo, useContext, useMemo, useReducer } from 'react';

import type { LedgerAccount } from '../../../ledgerLive/wallet/LedgerLive';

export type ChainWalletWithLedger =
  | (ChainWallet & {
      ledgerLiveAccount?: LedgerAccount;
      walletMethods?: any;
    })
  | null;

export const initialWallet = {
  [Chain.Avalanche]: null as ChainWalletWithLedger,
  [Chain.BinanceSmartChain]: null as ChainWalletWithLedger,
  [Chain.Binance]: null as ChainWalletWithLedger,
  [Chain.BitcoinCash]: null as ChainWalletWithLedger,
  [Chain.Bitcoin]: null as ChainWalletWithLedger,
  [Chain.Cosmos]: null as ChainWalletWithLedger,
  [Chain.Dogecoin]: null as ChainWalletWithLedger,
  [Chain.Ethereum]: null as ChainWalletWithLedger,
  [Chain.Litecoin]: null as ChainWalletWithLedger,
  [Chain.THORChain]: null as ChainWalletWithLedger,
};

const chainLoading = {
  [Chain.Avalanche]: false,
  [Chain.BinanceSmartChain]: false,
  [Chain.Binance]: false,
  [Chain.BitcoinCash]: false,
  [Chain.Bitcoin]: false,
  [Chain.Cosmos]: false,
  [Chain.Dogecoin]: false,
  [Chain.Ethereum]: false,
  [Chain.Litecoin]: false,
  [Chain.THORChain]: false,
};

export const walletInitialState = {
  chainLoading,
  hasVestingAlloc: false,
  hiddenAssets: (getFromStorage('hiddenAssets') || {}) as Record<Chain, string[]>,
  isConnectModalOpen: false,
  keystore: null as Keystore | null,
  oldBalance: initialWallet as Record<Chain, AssetValue[] | null>,
  phrase: '',
  pubKey: '',
  wallet: initialWallet,
};

type Action =
  | { type: 'connectKeystore'; payload: { keystore: Keystore; phrase: string; pubKey: string } }
  | { type: 'disconnect'; payload: undefined }
  | { type: 'disconnectByChain'; payload: Chain }
  | { type: 'hideAsset'; payload: { address: string; chain: Chain } }
  | { type: 'restoreHiddenAssets'; payload: Chain }
  | { type: 'setChainWallet'; payload: { chain: Chain; data: ChainWalletWithLedger } }
  | { type: 'setChainWalletLoading'; payload: { chain: Chain; loading: boolean } }
  | { type: 'setHasVestingAlloc'; payload: boolean }
  | { type: 'setIsConnectModalOpen'; payload: boolean }
  | { type: 'setWallet'; payload: typeof initialWallet };

type Dispatch = (action: Action) => void;
type ProviderProps = { children: React.ReactNode };

const WalletStateContext = createContext<typeof walletInitialState | undefined>(undefined);
const WalletUpdaterContext = createContext<Dispatch | undefined>(undefined);

const walletReducer = (state: typeof walletInitialState, { type, payload }: Action) => {
  switch (type) {
    case 'disconnect': {
      saveInStorage({ key: 'previousWallet', value: null });
      saveInStorage({ key: 'restorePreviousWallet', value: false });
      return { ...state, keystore: null, hasVestingAlloc: false, wallet: initialWallet };
    }
    case 'setHasVestingAlloc':
      return { ...state, hasVestingAlloc: payload };
    case 'setIsConnectModalOpen':
      return { ...state, isConnectModalOpen: payload };
    case 'setWallet':
      return { ...state, wallet: payload };
    case 'setChainWalletLoading':
      return {
        ...state,
        chainLoading: { ...state.chainLoading, [payload.chain]: payload.loading },
      };

    case 'disconnectByChain':
      return {
        ...state,
        chainLoading: { ...state.chainLoading, [payload]: false },
        wallet: { ...state.wallet, [payload]: null },
      };

    case 'connectKeystore': {
      const { keystore, phrase, pubKey } = payload;
      return { ...state, keystore, phrase, pubKey };
    }
    case 'hideAsset': {
      const { address, chain } = payload;
      const hiddenAssets = {
        ...state.hiddenAssets,
        [chain]: [...(state.hiddenAssets[chain] || []), address],
      };
      const chainWallet = state.wallet[chain as keyof typeof initialWallet];

      const filteredWallet = chainWallet
        ? {
            ...chainWallet,
            balance: chainWallet?.balance?.filter(
              (asset) => asset.toString() !== address,
            ) as AssetValue[],
          }
        : null;

      saveInStorage({ key: 'hiddenAssets', value: hiddenAssets });
      return { ...state, hiddenAssets, wallet: { ...state.wallet, [chain]: filteredWallet } };
    }
    case 'restoreHiddenAssets': {
      const hiddenAssets = { ...state.hiddenAssets, [payload]: undefined };
      saveInStorage({ key: 'hiddenAssets', value: hiddenAssets });

      return {
        ...state,
        hiddenAssets,
        wallet: {
          ...state.wallet,
          [payload]: {
            ...state.wallet[payload as keyof typeof initialWallet],
            balance: state.oldBalance[payload],
          },
        },
      };
    }

    case 'setChainWallet': {
      const balance = (payload.data?.balance || []).filter(
        (asset) => !state.hiddenAssets[payload.chain]?.includes(asset.toString()),
      );

      return {
        ...state,
        oldBalance: { ...state.oldBalance, [payload.chain]: payload.data?.balance },
        wallet: {
          ...state.wallet,
          [payload.chain]: { ...payload.data, balance },
        },
        chainLoading: { ...state.chainLoading, [payload.chain]: false },
      };
    }

    default: {
      return state;
    }
  }
};

const Provider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(walletReducer, walletInitialState);

  return (
    <WalletStateContext.Provider value={state}>
      <WalletUpdaterContext.Provider value={dispatch}>{children}</WalletUpdaterContext.Provider>
    </WalletStateContext.Provider>
  );
};

export const WalletProvider = memo(Provider);

export const useWalletState = () => {
  const walletState = useContext(WalletStateContext);
  if (typeof walletState === 'undefined') {
    throw new Error('useWalletState must be used within a WalletProvider');
  }
  return walletState;
};

export const useWalletDispatch = () => {
  const walletDispatch = useContext(WalletUpdaterContext);
  if (typeof walletDispatch === 'undefined') {
    throw new Error('useWalletDispatch must be used within a AppProvider');
  }

  return walletDispatch;
};

export const useWalletContext = () => {
  const walletState = useWalletState();
  const walletDispatch = useWalletDispatch();

  const walletContext: [typeof walletInitialState, Dispatch] = useMemo(
    () => [walletState, walletDispatch],
    [walletState, walletDispatch],
  );

  return walletContext;
};
