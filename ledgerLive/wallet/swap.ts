import type { Chain, SwapParams } from '@swapkit/core';
import { AssetValue, QuoteMode, RequestClient } from '@swapkit/core';

const getInboundData = () => {
  return RequestClient.get<any>(`https://thornode.thorswap.net/thorchain/inbound_addresses`);
};

export const getInboundFeeDataForChain = async (chain: Chain) => {
  const inboundData = await getInboundData();
  const chainAddressData = inboundData.find((item: any) => item.chain === chain);

  return parseInt(chainAddressData.gas_rate);
};

export const ledgerLiveSwap = async ({
  recipient,
  route,
  feeOptionKey,
  wallet,
}: SwapParams & { wallet: any }) => {
  const quoteMode = route.meta.quoteMode as QuoteMode;

  switch (quoteMode) {
    case QuoteMode.TC_SUPPORTED_TO_AVAX:
    case QuoteMode.TC_SUPPORTED_TO_TC_SUPPORTED:
    case QuoteMode.ETH_TO_AVAX:
    case QuoteMode.ETH_TO_TC_SUPPORTED:
    case QuoteMode.TC_SUPPORTED_TO_ETH: {
      const { fromAsset, amountIn, memo } = route.calldata;
      const assetValue = await AssetValue.fromIdentifier(
        fromAsset as `${Chain}.${string}`,
        amountIn,
      );
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
        assetValue,
        feeRate: parseInt(chainAddressData.gas_rate),
      };

      return walletInstance.transfer(params);
    }

    default: {
      throw new Error(`Quote mode ${quoteMode} not supported`);
    }
  }
};
