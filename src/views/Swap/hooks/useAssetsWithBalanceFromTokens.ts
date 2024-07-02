import type { EVMChain } from "@swapkit/sdk";
import { AssetValue, Chain } from "@swapkit/sdk";
import { useBalance } from "hooks/useBalance";
import { usePools } from "hooks/usePools";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Token } from "store/thorswap/types";
import { zeroAmount } from "types/app";

export const useAssetsWithBalanceFromTokens = (tokens: Token[], thorchainOnly?: boolean) => {
  const { getMaxBalance, isWalletConnected } = useBalance();
  const { synthAssets } = usePools();

  const [assetsWithBalance, setAssetsWithBalance] = useState<
    {
      asset: AssetValue;
      identifier: string;
      balance?: AssetValue;
    }[]
  >([]);

  const [synthAssetsWithBalance, setSynthAssetsWithBalance] = useState<
    {
      asset: AssetValue;
      provider: string;
      identifier: string;
      balance?: AssetValue;
    }[]
  >([]);

  const getBalance = useCallback(
    async (asset: AssetValue) => {
      const maxBalance = (await getMaxBalance(asset, true)) || zeroAmount;

      return isWalletConnected(asset.chain as Chain) && maxBalance.bigIntValue > 0n
        ? maxBalance
        : undefined;
    },
    [getMaxBalance, isWalletConnected],
  );

  useEffect(() => {
    Promise.all(
      synthAssets.map((asset) => {
        return getBalance(asset).then((balance) => ({
          asset,
          provider: "Thorchain",
          identifier: asset.symbol,
          balance,
        }));
      }),
    ).then((assets) => setSynthAssetsWithBalance(assets));
  }, [getBalance, synthAssets]);

  const handleAssetSets = useCallback(async () => {
    const filteredTokens = thorchainOnly
      ? tokens.filter((t) => t?.provider?.toLowerCase() === "thorchain")
      : tokens;

    const tokenPromises = filteredTokens.map(
      async ({ identifier, address, chain, ...rest }: Token) => {
        const assetChain = (chain || identifier.split(".")[0]) as EVMChain;
        const [id] = identifier.split("-");
        // if (id.includes('/') && !id.startsWith(Chain.THORChain)) return null;

        const asset = AssetValue.fromStringSync(
          [Chain.Avalanche, Chain.Ethereum, Chain.BinanceSmartChain, Chain.Arbitrum].includes(
            assetChain,
          )
            ? `${id}${address ? `-${address}` : ""}`
            : identifier,
        );

        if (!asset) return null;
        const balance = await getBalance(asset);

        return { asset, balance, identifier, ...rest };
      },
    );

    const assets = await Promise.all(tokenPromises);
    setAssetsWithBalance(
      assets.filter(Boolean) as {
        asset: AssetValue;
        balance?: AssetValue;
        identifier: string;
      }[],
    );
  }, [thorchainOnly, tokens, getBalance]);

  useEffect(() => {
    handleAssetSets();
  }, [handleAssetSets]);

  const assets = useMemo(
    () =>
      assetsWithBalance.find(
        (asset) => asset.identifier === "DOT.DOT" || asset.identifier === "DASH.DASH",
      )
        ? assetsWithBalance
        : assetsWithBalance.concat(synthAssetsWithBalance),
    [assetsWithBalance, synthAssetsWithBalance],
  );

  return assets;
};
