import { AssetValue, SwapKitNumber } from '@swapkit/core';
import { BTCAsset } from 'helpers/assets';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { zeroAmount } from 'types/app';

export const useRouteAssetParams = (baseRoute: string, defaultAsset?: AssetValue) => {
  const navigate = useNavigate();
  const { asset: assetParam } = useParams<{ asset: string }>();
  const [searchParams] = useSearchParams();
  const [asset, setAsset] = useState(
    () => (assetParam && AssetValue.fromStringSync(assetParam)) || defaultAsset || BTCAsset,
  );
  const [amount, setAmount] = useState(zeroAmount);
  const [initAmountString] = useState(searchParams.get('amount'));

  useEffect(() => {
    if (!initAmountString || !asset.decimal) return;

    try {
      const assetAmount = new SwapKitNumber({ value: initAmountString, decimal: asset.decimal });
      if (assetAmount.gte(0)) {
        setAmount(assetAmount);
      }
    } catch (error) {
      /* empty */
    }
  }, [asset.decimal, initAmountString]);

  useEffect(() => {
    const assetParamChanged = asset.toString() !== assetParam;
    const amountString = assetParamChanged ? '0' : amount.toSignificant();
    const amountParamChanged = amountString !== searchParams.get('amount');

    if (assetParamChanged || amountParamChanged) {
      const query = new URLSearchParams(
        amountString !== '0' ? { amount: amountString } : {},
      ).toString();

      navigate(`${baseRoute}/${asset.toString()}${query ? `?${query}` : ''}`);
    }

    if (assetParamChanged) {
      setAmount(zeroAmount);
    }
  }, [amount, asset, assetParam, baseRoute, navigate, searchParams]);

  return { asset, setAsset, amount, setAmount };
};
