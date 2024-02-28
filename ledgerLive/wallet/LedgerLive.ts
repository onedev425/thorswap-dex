import type {
  Account,
  BitcoinTransaction,
  CosmosTransaction,
  EthereumTransaction,
  Transaction,
} from '@ledgerhq/wallet-api-client';
import { FAMILIES, WalletAPIClient, WindowMessageTransport } from '@ledgerhq/wallet-api-client';
import {
  AssetValue,
  BaseDecimal,
  Chain,
  FeeOption,
  SwapKitNumber,
  WalletOption,
} from '@swapkit/core';
import type { UTXOTransferParams } from '@swapkit/toolbox-utxo';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { isBTCAsset } from 'helpers/assets';
import { ledgerLive } from 'services/ledgerLive';
import { IS_LEDGER_LIVE } from 'settings/config';

export type LedgerAccount = Account & { multichainBalance?: AssetValue[] };

export type LedgerLiveTransaction = Transaction;
export const LEDGER_LIVE_FAMILIES = FAMILIES;

export enum LedgerLiveChain {
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
      return AssetValue.fromChainOrSignature(Chain.Ethereum);
    case 'cosmos':
      return AssetValue.fromChainOrSignature(Chain.Cosmos);
    case 'bitcoin':
      return AssetValue.fromChainOrSignature(Chain.Bitcoin);
    case 'litecoin':
      return AssetValue.fromChainOrSignature(Chain.Litecoin);
    case 'dogecoin':
      return AssetValue.fromChainOrSignature(Chain.Dogecoin);
    case 'bitcoin_cash':
      return AssetValue.fromChainOrSignature(Chain.BitcoinCash);
    default:
      throw new Error('Unsupported currency');
  }
};

export const isLedgerLiveSupportedOutputAsset = (assetInput: AssetValue) =>
  !IS_LEDGER_LIVE ||
  isBTCAsset(assetInput) ||
  (assetInput.chain === Chain.Ethereum && !assetInput.isSynthetic) ||
  (assetInput.chain === Chain.BitcoinCash && !assetInput.isSynthetic) ||
  (assetInput.chain === Chain.Dogecoin && !assetInput.isSynthetic) ||
  (assetInput.chain === Chain.Litecoin && !assetInput.isSynthetic) ||
  (assetInput.chain === Chain.Cosmos && !assetInput.isSynthetic);

export const isLedgerLiveSupportedInputAsset = (assetInput: AssetValue) =>
  !IS_LEDGER_LIVE ||
  isBTCAsset(assetInput) ||
  (assetInput.chain === Chain.Cosmos && !assetInput.isSynthetic);

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
    const balance = (await walletMethods.getBalance(ledgerLiveAccount.address)) ?? [];

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
  }

  throw new Error(`Ledger connect is not supported for ${chain} chain`);
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
      const { getProvider, ETHToolbox } = await import('@swapkit/toolbox-evm');
      const { VoidSigner } = await import('ethers');

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

      const transfer = async ({
        assetValue,
        memo,
        recipient,
      }: {
        //TODO - use typing from SK if possible - check other transfer methods as well
        assetValue: AssetValue;
        memo: string;
        recipient: string;
      }) => {
        if (!assetValue) throw new Error('invalid asset');
        const signedTx = await ledgerLiveClient?.signTransaction(ledgerLiveAccount.id, {
          recipient,
          data: Buffer.from(memo || ''),
          amount: new BigNumberJS(assetValue.getValue('string')),
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
      const { GaiaToolbox } = await import('@swapkit/toolbox-cosmos');
      const ledgerLiveClient = new CosmosLedgerLive();
      const toolbox = GaiaToolbox();

      const getAddress = () => ledgerLiveAccount.address;

      const getBalance = async () => {
        const balance = (await ledgerLive().listAccounts(chain)).find(
          (account) => account.id === ledgerLiveAccount.id,
        )?.balance;

        return [
          AssetValue.fromChainOrSignature(
            Chain.Cosmos,
            SwapKitNumber.fromBigInt(
              BigInt(balance?.toString(10) || '0'),
              BaseDecimal.GAIA,
            ).getValue('string'),
          ),
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

      const transfer = async ({
        assetValue,
        memo,
        recipient,
      }: {
        assetValue: AssetValue;
        memo: string;
        recipient: string;
      }) => {
        if (!assetValue) throw new Error('invalid asset');
        const signedTx = await ledgerLiveClient?.signTransaction(ledgerLiveAccount.id, {
          family: LEDGER_LIVE_FAMILIES[5],
          recipient,
          amount: new BigNumberJS(assetValue.getValue('string')),
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
      const ledgerLiveClient = new BitcoinLedgerLive();
      const { BTCToolbox, LTCToolbox, BCHToolbox, DOGEToolbox } = await import(
        '@swapkit/toolbox-utxo'
      );
      const toolbox =
        chain === Chain.Bitcoin
          ? BTCToolbox({})
          : chain === Chain.Litecoin
            ? LTCToolbox({})
            : chain === Chain.BitcoinCash
              ? BCHToolbox({})
              : DOGEToolbox({});

      const getAddress = () => ledgerLiveAccount.address;

      const getBalance = async () => {
        const balance = (await ledgerLive().listAccounts(chain)).find(
          (account) => account.id === ledgerLiveAccount.id,
        )?.balance;

        return [
          AssetValue.fromChainOrSignature(
            chain,
            SwapKitNumber.fromBigInt(
              BigInt(balance?.toString(10) || '0'),
              BaseDecimal.BTC,
            ).getValue('string'),
          ),
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

      const transfer = async ({ assetValue, memo, recipient, feeRate }: UTXOTransferParams) => {
        if (!assetValue) throw new Error('invalid asset');
        const gasPrice = (await toolbox.getFeeRates())[FeeOption.Average];
        const signedTx = await ledgerLiveClient?.signTransaction(ledgerLiveAccount.id, {
          recipient,
          opReturnData: Buffer.from(memo || ''),
          amount: new BigNumberJS(assetValue.getValue('string')),
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
