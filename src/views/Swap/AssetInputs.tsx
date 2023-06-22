import { Amount, AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { AssetInput } from 'components/AssetInput';
import { AssetInputType } from 'components/AssetInput/types';
import { Box, Icon } from 'components/Atomic';
import { isAVAXAsset, isETHAsset } from 'helpers/assets';
import { useAssetListSearch } from 'hooks/useAssetListSearch';
import { memo, useCallback, useMemo, useState } from 'react';
import { Token } from 'store/thorswap/types';
import { useTokenAddresses } from 'views/Swap/hooks/useTokenAddresses';

import { useAssetsWithBalanceFromTokens } from './hooks/useAssetsWithBalanceFromTokens';

type Props = {
  onSwitchPair: (unsupported?: boolean) => void;
  onInputAssetChange: (asset: Asset) => void;
  onOutputAssetChange: (asset: Asset) => void;
  onInputAmountChange: (value: Amount) => void;
  inputAsset: AssetInputType;
  outputAsset: AssetInputType;
  tokens: Token[];
};

export const AssetInputs = memo(
  ({
    inputAsset,
    outputAsset,
    onInputAssetChange,
    onOutputAssetChange,
    onInputAmountChange,
    onSwitchPair,
    tokens,
  }: Props) => {
    const [iconRotate, setIconRotate] = useState(false);

    const thorchainERC20SupportedAddresses = useTokenAddresses('Thorchain-supported-ERC20');
    const thorchainAvaxSupportedAddresses = useTokenAddresses('Thorchain-supported-ARC20');

    const handleAssetSwap = useCallback(() => {
      const inputAddress = inputAsset.asset.symbol.split('-')[1]?.toLowerCase();
      const unsupportedEthOutput =
        inputAsset.asset.L1Chain === Chain.Ethereum &&
        !isETHAsset(inputAsset.asset) &&
        !thorchainERC20SupportedAddresses.includes(inputAddress);

      const unsupportedAvaxOutput =
        inputAsset.asset.L1Chain === Chain.Avalanche &&
        !isAVAXAsset(inputAsset.asset) &&
        !thorchainAvaxSupportedAddresses.includes(inputAddress);

      onSwitchPair(unsupportedEthOutput || unsupportedAvaxOutput);
      setIconRotate((rotate) => !rotate);
    }, [
      inputAsset.asset,
      onSwitchPair,
      thorchainAvaxSupportedAddresses,
      thorchainERC20SupportedAddresses,
    ]);

    const assetList = useAssetsWithBalanceFromTokens(tokens);

    const { assetInputProps, assets } = useAssetListSearch(assetList);

    const outputAssets = useMemo(() => {
      if (
        (!thorchainERC20SupportedAddresses?.length && !thorchainAvaxSupportedAddresses?.length) ||
        (inputAsset.asset.L1Chain === Chain.Ethereum &&
          outputAsset.asset.L1Chain === Chain.Ethereum) ||
        (inputAsset.asset.L1Chain === Chain.Avalanche &&
          outputAsset.asset.L1Chain === Chain.Avalanche) ||
        (inputAsset.asset.L1Chain === Chain.BinanceSmartChain &&
          outputAsset.asset.L1Chain === Chain.BinanceSmartChain)
      ) {
        return assets;
      }

      const thorchainSupported = assets.filter(
        ({ asset }) =>
          isETHAsset(asset) ||
          isAVAXAsset(asset) ||
          ![Chain.Ethereum, Chain.Avalanche].includes(asset?.L1Chain) ||
          (asset?.L1Chain === Chain.Ethereum &&
            thorchainERC20SupportedAddresses.includes(asset.symbol.split('-')[1]?.toLowerCase())) ||
          (asset?.L1Chain === Chain.Avalanche &&
            thorchainAvaxSupportedAddresses.includes(asset.symbol.split('-')[1]?.toLowerCase())),
      );

      return thorchainSupported;
    }, [
      assets,
      inputAsset.asset.L1Chain,
      outputAsset.asset.L1Chain,
      thorchainAvaxSupportedAddresses,
      thorchainERC20SupportedAddresses,
    ]);

    return (
      <div className="relative self-stretch md:w-full">
        <Box
          center
          className={classNames(
            'absolute -mt-0.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'p-1 md:p-2 rounded-xl md:rounded-[18px] cursor-pointer',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-transparent hover:brightness-125 transition',
          )}
          onClick={handleAssetSwap}
        >
          <Icon
            className={classNames('p-1 transition-all', {
              '-scale-x-100': iconRotate,
            })}
            color="white"
            name="arrowDown"
            size={20}
          />
        </Box>

        <AssetInput
          {...assetInputProps}
          assets={assets}
          className="!mb-1 flex-1 h-[111px]"
          onAssetChange={onInputAssetChange}
          onValueChange={onInputAmountChange}
          selectedAsset={inputAsset}
        />

        <AssetInput
          className="h-[111px]"
          {...assetInputProps}
          hideMaxButton
          assets={outputAssets}
          onAssetChange={onOutputAssetChange}
          selectedAsset={outputAsset}
        />
      </div>
    );
  },
);
