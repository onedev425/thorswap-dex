import { VoidSigner } from '@ethersproject/abstract-signer';
import {
  Account,
  BitcoinTransaction,
  CosmosTransaction,
  EthereumTransaction,
  FAMILIES,
  Transaction,
  WalletAPIClient,
  WindowMessageTransport,
} from '@ledgerhq/wallet-api-client';
import { baseAmount } from '@thorswap-lib/helpers';
import { Amount, AmountType, AssetAmount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { AssetAtom, GaiaToolbox } from '@thorswap-lib/toolbox-cosmos';
import { ETHToolbox, getProvider } from '@thorswap-lib/toolbox-evm';
import {
  BCHToolbox,
  BTCToolbox,
  DOGEToolbox,
  LTCToolbox,
  UTXOTransferParams,
} from '@thorswap-lib/toolbox-utxo';
import { Chain, WalletOption } from '@thorswap-lib/types';
import BigNumberJS from 'bignumber.js';
import { AssetInputType } from 'components/AssetInput/types';
import { isBTCAsset } from 'helpers/assets';
import { ledgerLive } from 'services/ledgerLive';
import { IS_LEDGER_LIVE } from 'settings/config';

export type LedgerAccount = Account & { multichainBalance?: AssetAmount[] };

export type LedgerLiveTransaction = Transaction;
export const LEDGER_LIVE_FAMILIES = FAMILIES;

export const getAssetForBalance = ({ symbol, chain }: { symbol: string; chain: string }) => {
  const isSynth = symbol.includes('/');
  const assetChain = (isSynth ? symbol.split('/')?.[0] : chain)?.toUpperCase() as Chain;
  const assetSymbol = (isSynth ? symbol.split('/')?.[1] : symbol)?.toUpperCase();

  return new AssetEntity(assetChain, assetSymbol, isSynth);
};

export const enum LedgerLiveChain {
  BTC = 'bitcoin',
  BCH = 'bitcoin_cash',
  LTC = 'litecoin',
  DOGE = 'dogecoin',
  ETH = 'ethereum',
  ATOM = 'cosmos',
}

export const LEDGER_LIVE_SUPPORTED_CHAINS: Chain[] = [
  Chain.Bitcoin,
  Chain.Ethereum,
  Chain.Cosmos,
  Chain.Litecoin,
  Chain.Dogecoin,
  Chain.BitcoinCash,
];

export const UNSUPPORTED_CHAINS = [Chain.Avalanche, Chain.Binance, Chain.THORChain];

export const mapChainToLedgerChain = (chain: Chain) => {
  switch (chain) {
    case Chain.Bitcoin:
      return LedgerLiveChain.BTC;
    case Chain.BitcoinCash:
      return LedgerLiveChain.BCH;
    case Chain.Litecoin:
      return LedgerLiveChain.LTC;
    case Chain.Dogecoin:
      return LedgerLiveChain.DOGE;
    case Chain.Cosmos:
      return LedgerLiveChain.ATOM;
    case Chain.Ethereum:
      return LedgerLiveChain.ETH;
    default:
      return LedgerLiveChain.BTC;
  }
};

export const mapLedgerChainToChain = (chain: LedgerLiveChain) => {
  switch (chain) {
    case LedgerLiveChain.ATOM:
      return Chain.Cosmos;
    case LedgerLiveChain.ETH:
      return Chain.Ethereum;
    case LedgerLiveChain.BTC:
      return Chain.Bitcoin;
    case LedgerLiveChain.BCH:
      return Chain.BitcoinCash;
    case LedgerLiveChain.LTC:
      return Chain.Litecoin;
    case LedgerLiveChain.DOGE:
      return Chain.Dogecoin;
    default:
      throw new Error('Unsupported chain');
  }
};

export const mapLedgerCurrencyToAsset = (currency: string) => {
  switch (currency) {
    case 'ethereum':
      return new AssetEntity(Chain.Ethereum, 'ETH');
    case 'cosmos':
      return AssetAtom;
    case 'bitcoin':
      return new AssetEntity(Chain.Bitcoin, 'BTC');
    case 'litecoin':
      return new AssetEntity(Chain.Litecoin, 'LTC');
    case 'dogecoin':
      return new AssetEntity(Chain.Dogecoin, 'DOGE');
    case 'bitcoin_cash':
      return new AssetEntity(Chain.BitcoinCash, 'BCH');
    default:
      throw new Error('Unsupported currency');
  }
};

export const isLedgerLiveSupportedOutputAsset = (assetInput: AssetInputType) =>
  !IS_LEDGER_LIVE ||
  isBTCAsset(assetInput.asset) ||
  (assetInput.asset.chain === Chain.Ethereum && !assetInput.asset.isSynth) ||
  (assetInput.asset.chain === Chain.BitcoinCash && !assetInput.asset.isSynth) ||
  (assetInput.asset.chain === Chain.Dogecoin && !assetInput.asset.isSynth) ||
  (assetInput.asset.chain === Chain.Litecoin && !assetInput.asset.isSynth) ||
  (assetInput.asset.chain === Chain.Cosmos && !assetInput.asset.isSynth);

export const isLedgerLiveSupportedInputAsset = (assetInput: AssetInputType) =>
  !IS_LEDGER_LIVE ||
  isBTCAsset(assetInput.asset) ||
  (assetInput.asset.chain === Chain.Cosmos && !assetInput.asset.isSynth);

export class LedgerLive {
  private transport;
  apiClient;

  constructor() {
    this.transport = new WindowMessageTransport();
    this.connect();
    this.apiClient = new WalletAPIClient(this.transport);
  }

  connect() {
    this.transport.connect();
  }

  disconnect() {
    this.transport.disconnect();
  }

  async listAccounts(chain: Chain) {
    return this.apiClient.account.list({
      currencyIds: [mapChainToLedgerChain(chain)],
    });
  }

  async requestAccount(chains?: Chain[]) {
    return this.apiClient.account.request({
      currencyIds: (chains || LEDGER_LIVE_SUPPORTED_CHAINS).map(mapChainToLedgerChain),
    });
  }

  async signTransaction(
    accountId: string,
    transaction: LedgerLiveTransaction,
    params?: {
      /**
       * The name of the Ledger Nano app to use for the signing process
       */
      hwAppId: string;
    },
  ) {
    return this.apiClient.transaction.signAndBroadcast(accountId, transaction, params);
  }
}

export const connectLedgerLive = async (chain: Chain, ledgerLiveAccount: LedgerAccount) => {
  if (!(chain in LEDGER_LIVE_SUPPORTED_CHAINS)) {
    const walletMethods = await getWalletMethods(chain, ledgerLiveAccount);
    if (!walletMethods) throw new Error(`Ledger connect is not supported for ${chain} chain`);
    const balances = (await walletMethods.getBalance(ledgerLiveAccount.address)) ?? [];
    const balance = balances.map(
      ({ amount, asset }) =>
        new AssetAmount(
          getAssetForBalance(asset),
          new Amount(amount.amount().toString() || '0', AmountType.BASE_AMOUNT, amount.decimal),
        ),
    );

    return {
      chain,
      wallet: {
        address: ledgerLiveAccount.address,
        balance,
        walletType: WalletOption.LEDGER,
        ledgerLiveAccount,
        walletMethods,
      },
    };
  } else {
    throw new Error(`Ledger connect is not supported for ${chain} chain`);
  }
};

export const ledgerLiveWallet = {
  connectMethodName: 'connectLedgerLive' as const,
  connect: connectLedgerLive,
  isDetected: () => true,
};

const getWalletMethods = async (chain: Chain, ledgerLiveAccount: LedgerAccount) => {
  switch (chain) {
    case Chain.Ethereum: {
      const getAddress = () => ledgerLiveAccount.address;

      const ledgerLiveClient = new EthereumLedgerLive();
      const provider = getProvider(Chain.Ethereum);

      const toolbox = ETHToolbox({
        provider,
        signer: new VoidSigner(ledgerLiveAccount.address, provider),
        ethplorerApiKey: (import.meta.env.VITE_ETHPLORER_API_KEY ||
          process.env.VITE_ETHPLORER_API_KEY) as string,
      });

      const sendTransaction = async (unsignedTx: any) => {
        const signedTx = await ledgerLiveClient?.signTransaction(ledgerLiveAccount.id, {
          recipient: unsignedTx.to,
          data: Buffer.from(unsignedTx.data?.substring(2) || '', 'hex'),
          amount: new BigNumberJS(unsignedTx.value || 0),
          family: LEDGER_LIVE_FAMILIES[1],
        });
        if (!signedTx) throw new Error('Could not sign transaction');
        return signedTx;
      };

      const transfer = async ({ asset, memo, amount, recipient }: any) => {
        if (!asset) throw new Error('invalid asset');
        const signedTx = await ledgerLiveClient?.signTransaction(ledgerLiveAccount.id, {
          recipient,
          data: Buffer.from(memo || ''),
          amount: new BigNumberJS(amount.amount().toString()),
          family: LEDGER_LIVE_FAMILIES[1],
        });

        if (!signedTx) throw new Error('Could not sign transaction');

        return signedTx;
      };

      return {
        ...toolbox,
        getAddress,
        transfer,
        sendTransaction,
      };
    }

    case Chain.Cosmos: {
      const asset = AssetAtom;
      const ledgerLiveClient = new CosmosLedgerLive();
      const toolbox = GaiaToolbox();

      const getAddress = () => ledgerLiveAccount.address;

      const getBalance = async () => {
        const balance = (await ledgerLive().listAccounts(chain)).find(
          (account) => account.id === ledgerLiveAccount.id,
        )?.balance;
        return [
          {
            asset,
            amount: baseAmount(balance?.toString() || '0', 6),
          },
        ];
      };

      const sendTransaction = async (unsignedTx: any) => {
        const signedTx = await ledgerLiveClient?.signTransaction(ledgerLiveAccount.id, {
          family: LEDGER_LIVE_FAMILIES[5],
          recipient: unsignedTx.to,
          amount: new BigNumberJS(unsignedTx.value || 0),
          memo: unsignedTx.memo || '',
          mode: 'send',
        });
        if (!signedTx) throw new Error('Could not sign transaction');
        return signedTx;
      };

      const transfer = async ({ asset, memo, amount, recipient }: any) => {
        if (!asset) throw new Error('invalid asset');
        const signedTx = await ledgerLiveClient?.signTransaction(ledgerLiveAccount.id, {
          family: LEDGER_LIVE_FAMILIES[5],
          recipient,
          amount: new BigNumberJS(amount.amount().toNumber()),
          memo,
          mode: 'send',
        });

        if (!signedTx) throw new Error('Could not sign transaction');

        return signedTx;
      };

      return {
        ...toolbox,
        getBalance,
        getAddress,
        transfer,
        sendTransaction,
      };
    }
    case Chain.Litecoin:
    case Chain.BitcoinCash:
    case Chain.Dogecoin:
    case Chain.Bitcoin: {
      const asset =
        chain === Chain.Bitcoin
          ? new AssetEntity(Chain.Bitcoin, 'BTC')
          : chain === Chain.Litecoin
          ? new AssetEntity(Chain.Litecoin, 'LTC')
          : chain === Chain.BitcoinCash
          ? new AssetEntity(Chain.BitcoinCash, 'BCH')
          : new AssetEntity(Chain.Dogecoin, 'DOGE');
      const ledgerLiveClient = new BitcoinLedgerLive();
      const toolbox =
        chain === Chain.Bitcoin
          ? BTCToolbox('')
          : chain === Chain.Litecoin
          ? LTCToolbox('')
          : chain === Chain.BitcoinCash
          ? BCHToolbox('')
          : DOGEToolbox('');

      const getAddress = () => ledgerLiveAccount.address;

      const getBalance = async () => {
        const balance = (await ledgerLive().listAccounts(chain)).find(
          (account) => account.id === ledgerLiveAccount.id,
        )?.balance;
        return [
          {
            asset,
            amount: baseAmount(balance?.toString() || '0', asset.decimal),
          },
        ];
      };

      const sendTransaction = async (unsignedTx: any) => {
        const signedTx = await ledgerLiveClient?.signTransaction(ledgerLiveAccount.id, {
          recipient: unsignedTx.to,
          opReturnData: Buffer.from(unsignedTx.memo || ''),
          amount: new BigNumberJS(unsignedTx.value || 0),
          family: LEDGER_LIVE_FAMILIES[0],
        });
        if (!signedTx) throw new Error('Could not sign transaction');
        return signedTx;
      };

      const transfer = async ({ asset, memo, amount, recipient, feeRate }: UTXOTransferParams) => {
        if (!asset) throw new Error('invalid asset');
        const gasPrice = await toolbox.getSuggestedFeeRate();
        const signedTx = await ledgerLiveClient?.signTransaction(ledgerLiveAccount.id, {
          recipient,
          opReturnData: Buffer.from(memo || ''),
          amount: new BigNumberJS(amount.amount().toNumber()),
          feePerByte: feeRate ? new BigNumberJS(Math.max(feeRate, gasPrice)) : undefined,
          family: LEDGER_LIVE_FAMILIES[0],
        });

        if (!signedTx) throw new Error('Could not sign transaction');

        return signedTx;
      };

      return {
        ...toolbox,
        getBalance,
        getAddress,
        transfer,
        sendTransaction,
      };
    }
  }
};

export class EthereumLedgerLive extends LedgerLive {
  async signTransaction(
    accountId: string,
    transaction: EthereumTransaction,
    params?: { hwAppId: string } | undefined,
  ) {
    return this.apiClient.transaction.signAndBroadcast(accountId, transaction, params);
  }
}

export class BitcoinLedgerLive extends LedgerLive {
  async signTransaction(
    accountId: string,
    transaction: BitcoinTransaction,
    params?: { hwAppId: string } | undefined,
  ) {
    return this.apiClient.transaction.signAndBroadcast(accountId, transaction, params);
  }
}

export class CosmosLedgerLive extends LedgerLive {
  async signTransaction(
    accountId: string,
    transaction: CosmosTransaction,
    params?: { hwAppId: string } | undefined,
  ) {
    return this.apiClient.transaction.signAndBroadcast(accountId, transaction, params);
  }
}

export default LedgerLive;
