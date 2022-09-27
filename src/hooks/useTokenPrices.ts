import { Amount, Asset, Price } from '@thorswap-lib/multichain-core';
import BigNumber from 'bignumber.js';
import { parseAssetToToken } from 'helpers/parseAssetToToken';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useMemo } from 'react';
import { useGetTokenCachedPricesQuery } from 'store/thorswap/api';
import { GetTokenPriceParams, GetTokenPriceResponse } from 'store/thorswap/types';
export type TokenParam = { asset: Asset; amount: BigNumber };

type Params = {
  inputAsset: Asset;
  inputAmount: Amount;
  outputAsset: Asset;
  outputAmount: Amount;
};

const getPrice = ({ asset, amount }: TokenParam, price?: number) =>
  new Price({
    baseAsset: asset,
    unitPrice: new BigNumber(price || 0),
    priceAmount: Amount.fromAssetAmount(amount, asset.decimal),
  });

const findToken =
  (searchedToken: GetTokenPriceParams[number]) =>
  ({ identifier }: GetTokenPriceResponse[number]) =>
    identifier === searchedToken.identifier;

export const useTokenPrices = ({ inputAsset, inputAmount, outputAmount, outputAsset }: Params) => {
  const tokenParams: [TokenParam, TokenParam] = useMemo(
    () => [
      { asset: inputAsset, amount: inputAmount.assetAmount },
      { asset: outputAsset, amount: outputAmount.assetAmount },
    ],
    [inputAmount.assetAmount, inputAsset, outputAmount.assetAmount, outputAsset],
  );

  const tokens = useMemo(
    () => tokenParams.map(({ asset }) => parseAssetToToken(asset)),
    [tokenParams],
  );

  const debouncedTokens = useDebouncedValue(tokens, 500);

  const { data, refetch, isLoading, isFetching } = useGetTokenCachedPricesQuery(debouncedTokens);

  const [inputPrice, outputPrice] = useMemo(() => {
    const [input, output] = tokens;

    const inputData = data?.find(findToken(input));
    const outputData = data?.find(findToken(output));

    return [inputData?.price_usd, outputData?.price_usd];
  }, [data, tokens]);

  const prices = useMemo(
    () => ({
      inputUSDPrice: getPrice(tokenParams[0], inputPrice),
      inputUnitPrice: inputPrice || 0,
      outputUSDPrice: getPrice(tokenParams[1], outputPrice),
      outputUnitPrice: outputPrice || 0,
    }),
    [inputPrice, outputPrice, tokenParams],
  );

  return { prices, refetch, isLoading: isLoading || isFetching } as const;
};
