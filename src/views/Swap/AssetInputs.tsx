import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { AssetInput } from 'components/AssetInput';
import { AssetInputType } from 'components/AssetInput/types';
import { AssetSelectType } from 'components/AssetSelect/types';
import { Box, Icon } from 'components/Atomic';
import Fuse from 'fuse.js';
import uniqBy from 'lodash/uniqBy';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAssets } from 'store/assets/hooks';
import { Token } from 'store/thorswap/types';
import {
  useThorchainAvaxSupportedAddresses,
  useThorchainErc20SupportedAddresses,
} from 'views/Swap/hooks/useThorchainSupported';

import { useAssetsWithBalanceFromTokens } from './hooks/useAssetsWithBalanceFromTokens';

type Props = {
  onSwitchPair: (unsupported?: boolean) => void;
  onInputAssetChange: (asset: Asset) => void;
  onOutputAssetChange: (asset: Asset) => void;
  onInputAmountChange: (value: Amount) => void;
  inputAsset: AssetInputType;
  outputAsset: AssetInputType;
  tokens: Token[];
  listLoading: boolean;
};

const options: Fuse.IFuseOptions<AssetSelectType> = {
  keys: [
    { name: 'asset.ticker', weight: 1 },
    { name: 'asset.name', weight: 0.5 },
    { name: 'asset.type', weight: 0.1 },
    { name: 'cg.name', weight: 0.1 },
    { name: 'cg.id', weight: 0.01 },
  ],
  isCaseSensitive: false,
  minMatchCharLength: 2,
  shouldSort: false,
  threshold: 0.1,
};

export const AssetInputs = memo(
  ({
    inputAsset,
    outputAsset,
    onInputAssetChange,
    onOutputAssetChange,
    onInputAmountChange,
    onSwitchPair,
    listLoading,
    tokens,
  }: Props) => {
    const fuse = useRef<Fuse<AssetSelectType>>(new Fuse([], options));
    const [query, setQuery] = useState('');
    const [iconRotate, setIconRotate] = useState(false);

    const { isFeatured, isFrequent } = useAssets();

    const thorchainERC20SupportedAddresses = useThorchainErc20SupportedAddresses();
    const thorchainAvaxSupportedAddresses = useThorchainAvaxSupportedAddresses();
    const handleAssetSwap = useCallback(() => {
      const inputAddress = inputAsset.asset.symbol.split('-')[1]?.toLowerCase();
      const unsupportedEthOutput =
        inputAsset.asset.L1Chain === Chain.Ethereum &&
        !inputAsset.asset.isETH() &&
        !thorchainERC20SupportedAddresses.includes(inputAddress);

      const unsupportedAvaxOutput =
        inputAsset.asset.L1Chain === Chain.Avalanche &&
        !inputAsset.asset.isAVAX() &&
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

    useEffect(() => {
      fuse.current = new Fuse<AssetSelectType>(assetList, options);
    }, [assetList]);

    const assets = useMemo(() => {
      const searchedAssets =
        query.length > 0
          ? fuse.current.search(query, { limit: 50 }).map(({ item }) => item)
          : assetList;

      const sortedAssets = searchedAssets.concat().sort((a, b) => {
        const aFeatured = isFeatured(a);
        const aFrequent = isFrequent(a);
        const bFeatured = isFeatured(b);

        if (!a.balance && !b.balance) {
          if (a.asset.type === 'Native') return -1;
          if (b.asset.type === 'Native') return 1;
          if (aFeatured || (aFrequent && !bFeatured)) {
            return -1;
          }
          const mcDiff = (b?.cg?.market_cap || 0) - (a?.cg?.market_cap || 0);

          return mcDiff;
        }

        if (!a.balance) return 1;
        if (!b.balance) return -1;

        return bFeatured ? 1 : aFeatured ? -1 : b.balance.gt(a.balance) ? 1 : -1;
      });

      return uniqBy(sortedAssets, ({ asset }) => asset.toString());
    }, [assetList, isFeatured, isFrequent, query]);

    const assetInputProps = useMemo(
      () => ({
        isLoading: listLoading,
        query,
        setQuery,
      }),
      [listLoading, query],
    );

    const outputAssets = useMemo(() => {
      if (
        (!thorchainERC20SupportedAddresses?.length && !thorchainAvaxSupportedAddresses?.length) ||
        (inputAsset.asset.L1Chain === Chain.Ethereum &&
          outputAsset.asset.L1Chain === Chain.Ethereum) ||
        (inputAsset.asset.L1Chain === Chain.Avalanche &&
          outputAsset.asset.L1Chain === Chain.Avalanche)
      ) {
        return assets;
      }

      const thorchainSupported = assets.filter(
        ({ asset }) =>
          asset.isETH() ||
          asset.isAVAX() ||
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
          className="!mb-1 flex-1"
          onAssetChange={onInputAssetChange}
          onValueChange={onInputAmountChange}
          selectedAsset={inputAsset}
        />

        <AssetInput
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
