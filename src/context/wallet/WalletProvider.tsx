import type { AssetValue, ChainWallet } from '@swapkit/core';
import { BaseDecimal, Chain, SwapKitNumber } from '@swapkit/core';
import type { Keystore } from '@swapkit/wallet-keystore';
import { getFromStorage, saveInStorage } from 'helpers/storage';
import { createContext, memo, useContext, useMemo, useReducer } from 'react';

import type { LedgerAccount } from '../../../ledgerLive/wallet/LedgerLive';

export type ChainWalletWithLedger<T> =
  | (T & {
      ledgerLiveAccount?: LedgerAccount;
      walletMethods?: any;
    })
  | null;

export const initialWallet = {
  [Chain.Avalanche]: null as ChainWalletWithLedger<ChainWallet<Chain.Avalanche>>,
  [Chain.BinanceSmartChain]: null as ChainWalletWithLedger<ChainWallet<Chain.BinanceSmartChain>>,
  [Chain.Binance]: null as ChainWalletWithLedger<ChainWallet<Chain.Binance>>,
  [Chain.BitcoinCash]: null as ChainWalletWithLedger<ChainWallet<Chain.BitcoinCash>>,
  [Chain.Bitcoin]: null as ChainWalletWithLedger<ChainWallet<Chain.Bitcoin>>,
  [Chain.Cosmos]: null as ChainWalletWithLedger<ChainWallet<Chain.Cosmos>>,
  [Chain.Dogecoin]: null as ChainWalletWithLedger<ChainWallet<Chain.Dogecoin>>,
  [Chain.Ethereum]: null as ChainWalletWithLedger<ChainWallet<Chain.Ethereum>>,
  [Chain.Litecoin]: null as ChainWalletWithLedger<ChainWallet<Chain.Litecoin>>,
  [Chain.THORChain]: null as ChainWalletWithLedger<ChainWallet<Chain.THORChain>>,
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

export const defaultVestingInfo = {
  totalVestedAmount: 'N/A',
  totalClaimedAmount: new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  startTime: '-',
  vestingPeriod: 0,
  cliff: 0,
  initialRelease: '-',
  claimableAmount: new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  hasAlloc: false,
};

export const walletInitialState = {
  chainLoading,
  thorVesting: defaultVestingInfo,
  vthorVesting: defaultVestingInfo,
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
  | {
      type: 'setChainWallet';
      payload: { chain: Chain; data: ChainWalletWithLedger<ChainWallet<Chain>> };
    }
  | { type: 'setChainWalletLoading'; payload: { chain: Chain; loading: boolean } }
  | { type: 'setTHORVesting'; payload: typeof defaultVestingInfo }
  | { type: 'setVTHORVesting'; payload: typeof defaultVestingInfo }
  | { type: 'setVestingAlloc'; payload: { hasThorAlloc: boolean; hasVthorAlloc: boolean } }
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
    case 'setTHORVesting':
      return { ...state, thorVesting: payload };
    case 'setVTHORVesting':
      return { ...state, vthorVesting: payload };
    case 'setVestingAlloc':
      return {
        ...state,
        thorVesting: { ...state.thorVesting, hasAlloc: payload.hasThorAlloc },
        vthorVesting: { ...state.vthorVesting, hasAlloc: payload.hasVthorAlloc },
      };

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
