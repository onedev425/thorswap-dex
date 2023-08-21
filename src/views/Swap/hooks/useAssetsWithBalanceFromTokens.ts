import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { Chain, EVMChain } from '@thorswap-lib/types';
import { useBalance } from 'hooks/useBalance';
import { useCallback, useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';
import { Token } from 'store/thorswap/types';

export const useAssetsWithBalanceFromTokens = (tokens: Token[], thorchainOnly?: boolean) => {
  const { synthAssets } = useMidgard();
  const { getMaxBalance, isWalletConnected } = useBalance();

  const getBalance = useCallback(
    (asset: AssetEntity) => {
      const maxBalance = getMaxBalance(asset);

      return isWalletConnected(asset.L1Chain as Chain) && maxBalance.gt(0) ? maxBalance : undefined;
    },
    [getMaxBalance, isWalletConnected],
  );

  const synthAssetsWithBalance = useMemo(
    () =>
      synthAssets.map((asset) => ({
        asset,
        provider: 'Thorchain',
        identifier: asset.symbol,
        balance: getBalance(asset),
      })),
    [getBalance, synthAssets],
  );

  const assetsWithBalance = useMemo(() => {
    const filteredTokens = thorchainOnly
      ? tokens.filter((t) => t?.tokenlist?.toLowerCase() === 'thorchain')
      : tokens;

    return filteredTokens
      .map(({ identifier, address, chain, ...rest }: Token) => {
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

          return { asset, balance: getBalance(asset), identifier, ...rest };
        } catch (error: NotWorth) {
          console.error(error);
          return null;
        }
      })
      .filter(Boolean) as { asset: AssetEntity; balance?: Amount; identifier: string }[];
  }, [thorchainOnly, tokens, getBalance]);

  const assets = useMemo(
    () => assetsWithBalance.concat(synthAssetsWithBalance),
    [assetsWithBalance, synthAssetsWithBalance],
  );

  return assets;
};
