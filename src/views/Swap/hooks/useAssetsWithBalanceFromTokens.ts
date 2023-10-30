import type { Amount } from '@thorswap-lib/swapkit-core';
import { AssetEntity } from '@thorswap-lib/swapkit-core';
import type { EVMChain } from '@thorswap-lib/types';
import { Chain } from '@thorswap-lib/types';
import { useBalance } from 'hooks/useBalance';
import { usePools } from 'hooks/usePools';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Token } from 'store/thorswap/types';
import { zeroAmount } from 'types/app';

export const useAssetsWithBalanceFromTokens = (tokens: Token[], thorchainOnly?: boolean) => {
  const { getMaxBalance, isWalletConnected } = useBalance();
  const { synthAssets } = usePools();

  const [assetsWithBalance, setAssetsWithBalance] = useState<
    {
      asset: AssetEntity;
      identifier: string;
      balance?: Amount;
    }[]
  >([]);

  const [synthAssetsWithBalance, setSynthAssetsWithBalance] = useState<
    {
      asset: AssetEntity;
      provider: string;
      identifier: string;
      balance: Amount | undefined;
    }[]
  >([]);

  const getBalance = useCallback(
    async (asset: AssetEntity) => {
      const maxBalance = (await getMaxBalance(asset, true)) || zeroAmount;

      return isWalletConnected(asset.L1Chain as Chain) && maxBalance.gt(0) ? maxBalance : undefined;
    },
    [getMaxBalance, isWalletConnected],
  );

  useEffect(() => {
    Promise.all(
      synthAssets.map((asset) => {
        return getBalance(asset).then((balance) => ({
          asset,
          provider: 'Thorchain',
          identifier: asset.symbol,
          balance,
        }));
      }),
    ).then((assets) => setSynthAssetsWithBalance(assets));
  }, [getBalance, synthAssets]);

  useEffect(() => {
    const filteredTokens = thorchainOnly
      ? tokens.filter((t) => t?.tokenlist?.toLowerCase() === 'thorchain')
      : tokens;
    Promise.all(
      filteredTokens.map(({ identifier, address, chain, ...rest }: Token) => {
        try {
          const assetChain = (chain || identifier.split('.')[0]) as EVMChain;
          const [id] = identifier.split('-');
          if (id.includes('/') && !id.startsWith(Chain.THORChain)) return null;

          const asset = AssetEntity.fromAssetString(
            [Chain.Avalanche, Chain.Ethereum, Chain.BinanceSmartChain].includes(assetChain)
              ? `${id}${address ? `-${address}` : ''}`
              : identifier,
          );

          if (!asset) return null;
          return getBalance(asset).then((balance) => ({
            asset,
            balance,
            identifier,
            ...rest,
          }));
        } catch (error: NotWorth) {
          console.error(error);
          return null;
        }
      }),
    ).then((assets) =>
      setAssetsWithBalance(
        assets.filter(Boolean) as { asset: AssetEntity; balance?: Amount; identifier: string }[],
      ),
    );
  }, [thorchainOnly, tokens, getBalance]);

  const assets = useMemo(
    () => assetsWithBalance.concat(synthAssetsWithBalance),
    [assetsWithBalance, synthAssetsWithBalance],
  );

  return assets;
};
