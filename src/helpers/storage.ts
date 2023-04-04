import { getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain, Keystore } from '@thorswap-lib/types';
import { HandleWalletConnectParams } from 'components/Modals/ConnectWalletModal/hooks';
import { MultisigWallet } from 'store/multisig/types';
import { TransactionsState } from 'store/transactions/types';
import { SupportedLanguages, ThemeType, ThousandSeparator, ViewMode } from 'types/app';

type StorageType = {
  annViewStatus: boolean;
  autoRouter: boolean;
  baseCurrency: string;
  chartsHidden: boolean;
  customRecipientMode: boolean;
  customSendVisible: boolean;
  disabledTokenLists: string[];
  dismissedAnnList: string[];
  expertMode: boolean;
  featuredAssets: string[];
  frequentAssets: string[];
  hiddenAssets: Record<Chain, string[]> | null;
  language: SupportedLanguages;
  multisigVisible: boolean;
  multisigWallet: MultisigWallet | null;
  nodeWatchList: string[];
  poolsHidden: boolean;
  previousWallet: null | HandleWalletConnectParams;
  readStatus: boolean;
  restorePreviousWallet: boolean;
  seenAnnList: string[];
  sidebarCollapsed: boolean;
  slippageTolerance: string;
  statsHidden: boolean;
  themeType: string;
  thorswapAddress: string | null;
  thorswapKeystore: Keystore | null;
  thousandSeparator: string;
  tradingHaltStatus: boolean;
  transactionDeadline: string;
  walletViewMode: ViewMode;
  txHistory: TransactionsState | null;
};

type StoragePayload =
  | {
      key:
        | 'baseCurrency'
        | 'language'
        | 'slippageTolerance'
        | 'themeType'
        | 'thorswapAddress'
        | 'thorswapKeystore'
        | 'thousandSeparator'
        | 'transactionDeadline'
        | 'walletViewMode';
      value: string;
    }
  | {
      key:
        | 'disabledTokenLists'
        | 'nodeWatchList'
        | 'frequentAssets'
        | 'featuredAssets'
        | 'dismissedAnnList'
        | 'seenAnnList';
      value: string[];
    }
  | {
      key:
        | 'annViewStatus'
        | 'autoRouter'
        | 'chartsHidden'
        | 'customRecipientMode'
        | 'expertMode'
        | 'poolsHidden'
        | 'readStatus'
        | 'sidebarCollapsed'
        | 'statsHidden'
        | 'multisigVisible'
        | 'customSendVisible'
        | 'tradingHaltStatus'
        | 'restorePreviousWallet';
      value: boolean;
    }
  | { key: 'multisigWallet'; value: MultisigWallet }
  | { key: 'txHistory'; value: TransactionsState }
  | { key: 'previousWallet'; value: HandleWalletConnectParams | null }
  | { key: 'hiddenAssets'; value: Record<Chain, string[]> };

const defaultValues: StorageType = {
  annViewStatus: false,
  autoRouter: true,
  chartsHidden: false,
  customRecipientMode: false,
  expertMode: false,
  multisigVisible: true,
  customSendVisible: false,
  poolsHidden: false,
  readStatus: false,
  restorePreviousWallet: false,
  sidebarCollapsed: false,
  statsHidden: false,
  tradingHaltStatus: false,

  hiddenAssets: null,
  multisigWallet: null,
  previousWallet: null,
  thorswapAddress: null,
  thorswapKeystore: null,

  disabledTokenLists: ['CoinGecko', 'Uniswap'] as string[],
  dismissedAnnList: [] as string[],
  featuredAssets: [] as string[],
  frequentAssets: [] as string[],
  nodeWatchList: [] as string[],
  seenAnnList: [] as string[],

  baseCurrency: getSignatureAssetFor('USD').toString(),
  language: 'en',
  slippageTolerance: '3',
  themeType: ThemeType.Auto,
  thousandSeparator: ThousandSeparator.Comma,
  transactionDeadline: '30',
  walletViewMode: ViewMode.CARD,
  txHistory: [],
};

export const saveInStorage = ({ key, value }: StoragePayload) => {
  switch (key) {
    case 'disabledTokenLists':
    case 'dismissedAnnList':
    case 'featuredAssets':
    case 'frequentAssets':
    case 'hiddenAssets':
    case 'multisigWallet':
    case 'nodeWatchList':
    case 'seenAnnList':
    case 'txHistory':
      localStorage.setItem(key, JSON.stringify(value));
      break;

    case 'annViewStatus':
    case 'chartsHidden':
    case 'customRecipientMode':
    case 'expertMode':
    case 'multisigVisible':
    case 'customSendVisible':
    case 'poolsHidden':
    case 'readStatus':
    case 'restorePreviousWallet':
    case 'sidebarCollapsed':
    case 'statsHidden':
    case 'tradingHaltStatus':
    case 'autoRouter':
      localStorage.setItem(key, value.toString());
      break;

    case 'thorswapAddress':
    case 'walletViewMode':
      sessionStorage.setItem(key, value);
      break;

    case 'previousWallet':
    case 'thorswapKeystore':
      sessionStorage.setItem(key, JSON.stringify(value));
      break;

    default:
      localStorage.setItem(key, value);
      break;
  }
};

export const getFromStorage = (key: keyof StorageType): StorageType[keyof StorageType] => {
  switch (key) {
    case 'nodeWatchList':
    case 'featuredAssets':
    case 'dismissedAnnList':
    case 'disabledTokenLists':
    case 'frequentAssets':
    case 'hiddenAssets':
    case 'multisigWallet':
    case 'txHistory': {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValues[key];
    }

    case 'annViewStatus':
    case 'autoRouter':
    case 'chartsHidden':
    case 'customRecipientMode':
    case 'multisigVisible':
    case 'customSendVisible':
    case 'poolsHidden':
    case 'readStatus':
    case 'restorePreviousWallet':
    case 'sidebarCollapsed':
    case 'statsHidden':
    case 'tradingHaltStatus':
    case 'expertMode': {
      const item = localStorage.getItem(key);
      return item === 'true';
    }

    case 'thorswapAddress':
      return sessionStorage.getItem(key);

    case 'previousWallet':
    case 'thorswapKeystore': {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValues[key];
    }

    case 'walletViewMode': {
      const walletViewMode = localStorage.getItem(key);

      if (walletViewMode !== ViewMode.LIST) return ViewMode.CARD;

      return walletViewMode ? (walletViewMode as ViewMode) : ViewMode.CARD;
    }

    default:
      return localStorage.getItem(key) || defaultValues[key];
  }
};
