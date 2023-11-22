import {
  AssetValue,
  Chain,
  getMemoFor,
  getMinAmountByChain,
  MemoType,
  SwapKitNumber,
} from '@swapkit/core';
import { RUNEAsset } from 'helpers/assets';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMultisigTxCreateRoute, ROUTES } from 'settings/router';
import { LiquidityTypeOption, PoolShareType } from 'store/midgard/types';
import { useMultisig } from 'store/multisig/hooks';
import { useTxCreate } from 'views/Multisig/TxCreate/TxCreateContext';

const SHARE_TYPES: PoolShareType[] = [PoolShareType.SYM, PoolShareType.RUNE_ASYM];

export const useTxWithdraw = () => {
  const { createDepositTx } = useMultisig();
  const { signers } = useTxCreate();
  const navigate = useNavigate();

  const poolAssetList = useAssetsWithBalance();
  const [poolAsset, setPoolAsset] = useState<AssetValue>(
    AssetValue.fromChainOrSignature(Chain.Bitcoin),
  );
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

  const { assetParam = AssetValue.fromChainOrSignature(Chain.Bitcoin).toString() } = useParams<{
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

    return AssetValue.fromChainOrSignature(Chain.THORChain);
  }, [withdrawType, poolAsset]);

  const isValid = percent > 0;

  useEffect(() => {
    const getAssetEntity = async () => {
      if (!assetParam) {
        return;
      }

      const assetEntity = await AssetValue.fromString(assetParam);

      if (assetEntity) {
        if (assetEntity.eq(RUNEAsset)) return;
        setPoolAsset(assetEntity);
      }
    };

    getAssetEntity();
  }, [assetParam]);

  const handleSelectPoolAsset = useCallback(
    (poolAssetData: AssetValue) => {
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

  const handleChangePercent = useCallback((p: SwapKitNumber) => {
    setPercent(Number(p.toSignificant(2)));
  }, []);

  const handleConfirmWithdraw = async () => {
    if (!isValid) return;

    const { chain, symbol, ticker } =
      lpType === PoolShareType.RUNE_ASYM || withdrawType === LiquidityTypeOption.RUNE
        ? poolAsset
        : AssetValue.fromChainOrSignature(Chain.THORChain);

    const memo = getMemoFor(MemoType.WITHDRAW, {
      chain,
      symbol,
      ticker,
      basisPoints: new SwapKitNumber({ value: percent, decimal: 2 }).mul(100).getValue('number'),
    });

    const tx = await createDepositTx({
      memo,
      assetValue: getMinAmountByChain(Chain.THORChain),
    });

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
