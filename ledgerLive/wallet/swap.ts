import type { SwapParams } from '@swapkit/core';
import { AssetValue, Chain, QuoteMode, RequestClient, SwapKitNumber } from '@swapkit/core';

const getInboundData = () => {
  return RequestClient.get<any>('https://thornode.thorswap.net/thorchain/inbound_addresses');
};

export const getInboundFeeDataForChain = async (chain: Chain) => {
  const inboundData = await getInboundData();
  const chainAddressData = inboundData.find((item: any) => item.chain === chain);

  return parseInt(chainAddressData.gas_rate);
};

export const ledgerLiveSwap = async ({
  recipient,
  // @ts-expect-error
  route,
  // @ts-expect-error
  feeOptionKey,
  wallet,
}: SwapParams & { wallet: any }) => {
  if (route.provider === 'CHAINFLIP') {
    const { confirmSwap } = await import('@swapkit/chainflip');

    const { buyAsset: buyAssetString, sellAsset: sellAssetString, sellAmount } = route;
    const sellAsset = await AssetValue.fromString(sellAssetString);
    const buyAsset = await AssetValue.fromString(buyAssetString);
    const assetValue = sellAsset.set(sellAmount);

    const walletInstance = wallet[assetValue.chain].walletMethods;

    if (!walletInstance) throw new Error(`Chain ${assetValue.chain} is not connected`);

    const channelInfo = await confirmSwap({
      buyAsset,
      sellAsset,
      recipient,
      brokerEndpoint: 'https://gateway-d32mo7lc.uc.gateway.dev/channel',
    });

    return walletInstance.transfer({
      recipient: channelInfo.depositAddress,
      memo: '',
      from: walletInstance.getAddress(),
      assetValue,
    });
  }

  const quoteMode = route.meta.quoteMode as QuoteMode;

  switch (quoteMode) {
    case QuoteMode.TC_SUPPORTED_TO_AVAX:
    case QuoteMode.TC_SUPPORTED_TO_TC_SUPPORTED:
    case QuoteMode.ETH_TO_AVAX:
    case QuoteMode.ETH_TO_TC_SUPPORTED:
    case QuoteMode.TC_SUPPORTED_TO_ETH: {
      const { fromAsset, amountIn, memo } = route.calldata;
      const assetValue = await AssetValue.fromIdentifier(fromAsset as `${Chain}.${string}`);
      if (!assetValue) throw new Error('Asset not recognised');

      const replacedMemo = memo.replace('{recipientAddress}', recipient);

      const inboundData = await getInboundData();
      const chainAddressData = inboundData.find((item: any) => item.chain === assetValue.chain);

      if (!chainAddressData) throw new Error('pool address not found');
      if (chainAddressData?.halted) {
        throw new Error('Network temporarily halted, please try again later.');
      }

      const { address: inboundAddress } = chainAddressData;

      const chain = assetValue.chain;

      const walletInstance = wallet[assetValue.chain].walletMethods;

      if (!walletInstance) throw new Error(`Chain ${chain} is not connected`);

      // TODO remove after ledger live was moved to swapkit
      const validateAddressType = ({ chain, address }: { chain: Chain; address?: string }) => {
        if (!address) return false;

        switch (chain) {
          case Chain.Bitcoin:
            // filter out taproot addresses
            return !address.startsWith('bc1p');
          default:
            return true;
        }
      };

      const validAddress = validateAddressType({ chain, address: walletInstance.getAddress() });
      if (!validAddress) {
        throw new Error('Sender address not supported by THORChain');
      }

      const params:
        | {
            assetValue: AssetValue;
            memo: string;
            recipient: string;
          }
        | any = {
        recipient: inboundAddress,
        // router: route.contract,
        memo: replacedMemo,
        feeOptionKey,
        from: walletInstance.getAddress(),
        //TODO - fix this typing
        assetValue: assetValue.set(SwapKitNumber.fromBigInt(BigInt(amountIn), assetValue.decimal)),
        feeRate: parseInt(chainAddressData.gas_rate),
      };

      return walletInstance.transfer(params);
    }

    default: {
      throw new Error(`Quote mode ${quoteMode} not supported`);
    }
  }
};
