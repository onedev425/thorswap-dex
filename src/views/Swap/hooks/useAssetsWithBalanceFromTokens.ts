import { Asset } from '@thorswap-lib/multichain-sdk';
import { SupportedChain } from '@thorswap-lib/types';
import { AssetSelectType } from 'components/AssetSelect/types';
import { useBalance } from 'hooks/useBalance';
import { useCallback, useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';
import { Token } from 'store/thorswap/types';

export const useAssetsWithBalanceFromTokens = (tokens: Token[]) => {
  const { synthAssets } = useMidgard();
  const { getMaxBalance, isWalletConnected } = useBalance();

  const getBalance = useCallback(
    (asset: Asset) => {
      const maxBalance = getMaxBalance(asset);

      return isWalletConnected(asset.L1Chain as SupportedChain) && maxBalance.gt(0)
        ? maxBalance
        : undefined;
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

  const assetsWithBalance = useMemo(
    () =>
      tokens
        .map(({ chain, identifier, address, ...rest }: Token) => {
          try {
            const asset = Asset.fromAssetString(
              chain === 'ETH' ? `${identifier}-${address}` : identifier,
            );

            if (!asset) return null;

            return { asset, balance: getBalance(asset), identifier, ...rest };
          } catch (error) {
            console.info(error);
            return null;
          }
        })
        .filter(Boolean) as AssetSelectType[],
    [tokens, getBalance],
  );

  const assets = useMemo(
    () => assetsWithBalance.concat(synthAssetsWithBalance),
    [assetsWithBalance, synthAssetsWithBalance],
  );

  return assets;
};
