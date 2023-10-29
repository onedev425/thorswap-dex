import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { BTCAsset } from 'helpers/assets';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { zeroAmount } from 'types/app';

export const useRouteAssetParams = (baseRoute: string, defaultAsset?: AssetEntity) => {
  const navigate = useNavigate();
  const { asset: assetParam } = useParams<{ asset: string }>();
  const [searchParams] = useSearchParams();
  const [asset, setAsset] = useState(
    () => (assetParam && AssetEntity.decodeFromURL(assetParam)) || defaultAsset || BTCAsset,
  );
  const [amount, setAmount] = useState(zeroAmount);
  const [initAmountString] = useState(searchParams.get('amount'));

  useEffect(() => {
    if (!initAmountString || !asset.decimal) return;

    const assetAmount = Amount.fromAssetAmount(initAmountString, asset.decimal);
    if (assetAmount.gte(0)) {
      setAmount(assetAmount);
    }
  }, [asset.decimal, initAmountString]);

  useEffect(() => {
    const assetParamChanged = asset.toURLEncoded() !== assetParam;
    const amountString = assetParamChanged ? '0' : amount.assetAmount.toString();
    const amountParamChanged = amountString !== searchParams.get('amount');

    if (assetParamChanged || amountParamChanged) {
      const query = new URLSearchParams(
        amountString !== '0' ? { amount: amountString } : {},
      ).toString();

      navigate(`${baseRoute}/${asset.toURLEncoded()}${query ? `?${query}` : ''}`);
    }

    if (assetParamChanged) {
      setAmount(zeroAmount);
    }
  }, [amount.assetAmount, asset, assetParam, baseRoute, navigate, searchParams]);

  return { asset, setAsset, amount, setAmount };
};
