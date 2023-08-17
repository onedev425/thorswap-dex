import { Amount, Price } from '@thorswap-lib/swapkit-core';
import { showErrorToast } from 'components/Toast';
import { RUNEAsset } from 'helpers/assets';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { ROUTES } from 'settings/router';
import { useMidgard } from 'store/midgard/hooks';
import { useMultisig } from 'store/multisig/hooks';
import { useMultissigAssets } from 'views/Multisig/hooks';
import { useTxCreate } from 'views/Multisig/TxCreate/TxCreateContext';

export const useTxDepositCustom = () => {
  const { signers } = useTxCreate();
  const navigate = useNavigate();
  const { getMaxBalance } = useMultissigAssets();

  const [depositAmount, setDepositAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8));

  const [memo, setMemo] = useState('');
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const { pools: periodPools } = useMidgard();
  const pools = periodPools['7d'];

  const assetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: RUNEAsset,
        pools,
        priceAmount: depositAmount,
      }),
    [depositAmount, pools],
  );

  const maxSpendableBalance: Amount = useMemo(() => getMaxBalance(RUNEAsset), [getMaxBalance]);

  const assetInput = useMemo(
    () => ({
      asset: RUNEAsset,
      value: depositAmount,
      balance: maxSpendableBalance,
      usdPrice: assetPriceInUSD,
    }),
    [depositAmount, maxSpendableBalance, assetPriceInUSD],
  );

  const handleChangeDepositAmount = useCallback(
    (amount: Amount) =>
      setDepositAmount(amount.gt(maxSpendableBalance) ? maxSpendableBalance : amount),
    [maxSpendableBalance],
  );

  const handleChangeMemo = useCallback(({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setMemo(value);
  }, []);

  const handleCancelConfirm = useCallback(() => {
    setIsOpenConfirmModal(false);
  }, []);

  const { createDepositTx } = useMultisig();

  const handleCreateTx = async () => {
    const tx = await createDepositTx(
      {
        memo,
        asset: RUNEAsset,
        amount: depositAmount,
      },
      signers,
    );

    if (tx) {
      navigate(ROUTES.TxMultisig, {
        state: { tx, signers },
      });
    }
  };

  const handleDeposit = useCallback(() => {
    if (!memo) {
      showErrorToast(t('views.multisig.memoRequired'));

      return;
    }

    setIsOpenConfirmModal(true);
  }, [memo]);

  return {
    isOpenConfirmModal,
    memo,
    assetInput,
    depositAmount,
    handleChangeDepositAmount,
    handleChangeMemo,
    handleCancelConfirm,
    handleCreateTx,
    handleDeposit,
  };
};
