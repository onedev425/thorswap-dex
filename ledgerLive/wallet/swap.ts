import { baseAmount, getRequest } from '@thorswap-lib/helpers';
import type { SwapParams } from '@thorswap-lib/swapkit-core';
import { AssetEntity, QuoteMode } from '@thorswap-lib/swapkit-core';
import type { Chain } from '@thorswap-lib/types';

const getInboundData = () => {
  return getRequest<any>(`https://thornode.thorswap.net/thorchain/inbound_addresses`);
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
      const asset = AssetEntity.fromAssetString(fromAsset);
      if (!asset) throw new Error('Asset not recognised');

      const replacedMemo = memo.replace('{recipientAddress}', recipient);

      const inboundData = await getInboundData();
      const chainAddressData = inboundData.find((item: any) => item.chain === asset.chain);

      if (!chainAddressData) throw new Error('pool address not found');
      if (chainAddressData?.halted) {
        throw new Error('Network temporarily halted, please try again later.');
      }

      const { address: inboundAddress } = chainAddressData;

      const chain = asset.L1Chain;

      const walletInstance = wallet[asset.chain].walletMethods;

      if (!walletInstance) throw new Error(`Chain ${chain} is not connected`);

      const params = {
        recipient: inboundAddress,
        // router: route.contract,
        memo: replacedMemo,
        feeOptionKey,
        from: walletInstance.getAddress(),
        amount: baseAmount(amountIn, asset.decimal),
        asset,
        feeRate: parseInt(chainAddressData.gas_rate),
      };

      return walletInstance.transfer(params);
    }

    default: {
      throw new Error(`Quote mode ${quoteMode} not supported`);
    }
  }
};
