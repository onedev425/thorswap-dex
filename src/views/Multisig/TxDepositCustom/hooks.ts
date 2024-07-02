import { AssetValue, Chain, SwapKitNumber } from "@swapkit/sdk";
import { showErrorToast } from "components/Toast";
import { RUNEAsset } from "helpers/assets";
import { useTokenPrices } from "hooks/useTokenPrices";
import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "services/i18n";
import { ROUTES } from "settings/router";
import { useMultisig } from "store/multisig/hooks";
import { useTxCreate } from "views/Multisig/TxCreate/TxCreateContext";
import { useMultissigAssets } from "views/Multisig/hooks";

export const useTxDepositCustom = () => {
  const { signers } = useTxCreate();
  const navigate = useNavigate();
  const { getMaxBalance } = useMultissigAssets();

  const [depositAmount, setDepositAmount] = useState<SwapKitNumber>(
    new SwapKitNumber({ value: 0, decimal: 8 }),
  );

  const [memo, setMemo] = useState("");
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const { data } = useTokenPrices([RUNEAsset]);
  const assetPriceInUSD = useMemo(
    () => data[RUNEAsset.ticker]?.price_usd || 0 * depositAmount.getValue("number"),
    [data, depositAmount],
  );

  const maxSpendableBalance = useMemo(() => getMaxBalance(RUNEAsset), [getMaxBalance]);

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
    (assetValue: SwapKitNumber) =>
      setDepositAmount(
        assetValue.gt(maxSpendableBalance.getValue("string"))
          ? new SwapKitNumber({
              value: maxSpendableBalance.getValue("string"),
              decimal: maxSpendableBalance.decimal,
            })
          : assetValue,
      ),
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
    const tx = await createDepositTx({
      memo,
      assetValue: AssetValue.fromChainOrSignature(
        Chain.THORChain,
        depositAmount.getValue("string"),
      ),
    });

    if (tx) {
      navigate(ROUTES.TxMultisig, {
        state: { tx, signers },
      });
    }
  };

  const handleDeposit = useCallback(() => {
    if (!memo) {
      showErrorToast(t("views.multisig.memoRequired"));

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
