import { Amount, Asset, AssetAmount, Memo, Percent } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { LiquidityTypeOption } from 'components/LiquidityType/types';
import { getERC20Decimal } from 'helpers/getERC20Decimal';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMultisigTxCreateRoute, ROUTES } from 'settings/constants';
import { PoolShareType } from 'store/midgard/types';
import { useMultisig } from 'store/multisig/hooks';
import { useAppSelector } from 'store/store';
import { useTxCreate } from 'views/Multisig/TxCreate/TxCreateContext';

const SHARE_TYPES: PoolShareType[] = [PoolShareType.SYM, PoolShareType.RUNE_ASYM];

export const useTxWithdraw = () => {
  const { createDepositTx } = useMultisig();
  const { signers } = useTxCreate();
  const navigate = useNavigate();
  const { pools } = useAppSelector(({ midgard }) => midgard);
  const poolAssets = useMemo(() => {
    return pools.map((poolData) => poolData.asset);
  }, [pools]);
  const poolAssetList = useAssetsWithBalance(poolAssets);
  const [poolAsset, setPoolAsset] = useState<Asset>(Asset.BTC());
  const [lpType, setLPType] = useState(SHARE_TYPES[0]);
  const defaultWithdrawType = useMemo(() => {
    switch (lpType) {
      case PoolShareType.RUNE_ASYM:
        return LiquidityTypeOption.RUNE;
      default:
        return LiquidityTypeOption.SYMMETRICAL;
    }
  }, [lpType]);

  const [withdrawType, setWithdrawType] = useState(defaultWithdrawType);
  const [percent, setPercent] = useState(0);

  const { assetParam = Asset.BTC().toString() } = useParams<{
    assetParam: string;
  }>();

  const withdrawOptions = useMemo(() => {
    if (lpType === PoolShareType.RUNE_ASYM) return [LiquidityTypeOption.RUNE];

    return [LiquidityTypeOption.SYMMETRICAL, LiquidityTypeOption.RUNE];
  }, [lpType]);

  const sendAsset = useMemo(() => {
    if (withdrawType === LiquidityTypeOption.ASSET) {
      return poolAsset;
    }

    return Asset.RUNE();
  }, [withdrawType, poolAsset]);

  const isValid = percent > 0;

  useEffect(() => {
    const getAssetEntity = async () => {
      if (!assetParam) {
        return;
      }

      const assetEntity = Asset.decodeFromURL(assetParam);

      if (assetEntity) {
        if (assetEntity.isRUNE()) return;
        const assetDecimals =
          assetEntity && assetEntity.L1Chain === Chain.Ethereum
            ? await getERC20Decimal(assetEntity)
            : undefined;

        await assetEntity.setDecimal(assetDecimals);

        setPoolAsset(assetEntity);
      }
    };

    getAssetEntity();
  }, [assetParam]);

  const handleSelectPoolAsset = useCallback(
    (poolAssetData: Asset) => {
      navigate(getMultisigTxCreateRoute(poolAssetData));
    },
    [navigate],
  );

  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);

  const handleSetLPType = useCallback((type: PoolShareType) => {
    setLPType(type);
    if (type === PoolShareType.RUNE_ASYM) {
      setWithdrawType(LiquidityTypeOption.RUNE);
    } else {
      setWithdrawType(LiquidityTypeOption.SYMMETRICAL);
    }
  }, []);

  const handleChangePercent = useCallback((p: Amount) => {
    setPercent(Number(p.toFixed(2)));
  }, []);

  const handleConfirmWithdraw = async () => {
    if (!isValid) {
      return;
    }
    let memo: string;

    if (lpType === PoolShareType.RUNE_ASYM) {
      memo = Memo.withdrawMemo(poolAsset, new Percent(percent));
    } else {
      if (withdrawType === LiquidityTypeOption.SYMMETRICAL) {
        memo = Memo.withdrawMemo(poolAsset, new Percent(percent), poolAsset);
      } else {
        memo = Memo.withdrawMemo(poolAsset, new Percent(percent), Asset.RUNE());
      }
    }

    const tx = await createDepositTx(
      {
        memo,
        amount: AssetAmount.getMinAmountByChain(Chain.THORChain).amount,
        asset: Asset.RUNE(),
      },
      signers,
    );

    if (tx) {
      navigate(ROUTES.TxMultisig, {
        state: { tx, signers },
      });
    }
  };

  return {
    poolAssetList,
    poolAsset,
    handleSelectPoolAsset,
    setVisibleConfirmModal,
    visibleConfirmModal,
    handleConfirmWithdraw,
    percent,
    setPercent,
    withdrawType,
    withdrawOptions,
    setWithdrawType,
    handleSetLPType,
    lpType,
    handleChangePercent,
    sendAsset,
    isValid,
    shareTypes: SHARE_TYPES,
  };
};
