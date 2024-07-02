import { type AssetValue, BaseDecimal, SwapKitNumber } from "@swapkit/sdk";
import { useWallet } from "context/wallet/hooks";
import { useDebouncedValue } from "hooks/useDebouncedValue";
import { useNetworkFee } from "hooks/useNetworkFee";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSaverQuote } from "store/midgard/actions";
import type { SaverQuoteResponse } from "views/Earn/types";

type Props = {
  isDeposit: boolean;
  asset: AssetValue;
  withdrawPercent?: SwapKitNumber;
  amount: SwapKitNumber;
  apr?: number;
};

export const useEarnCalculations = ({ isDeposit, asset, withdrawPercent, amount, apr }: Props) => {
  const [saverQuote, setSaverQuoteData] = useState<SaverQuoteResponse>();
  const { getWalletAddress } = useWallet();

  const assetAmount = useMemo(
    () => new SwapKitNumber({ value: amount.getValue("number"), decimal: asset.decimal }),
    [amount, asset.decimal],
  );

  const debouncedAmount = useDebouncedValue(assetAmount);
  const debouncedWithdrawPercent = useDebouncedValue(withdrawPercent);
  const address = useMemo(() => getWalletAddress(asset.chain), [getWalletAddress, asset.chain]);

  const getConfirmData = useCallback(async () => {
    if (!(asset.decimal && debouncedAmount?.gt(0))) {
      return;
    }

    const amount = SwapKitNumber.shiftDecimals({
      value: debouncedAmount,
      from: asset.decimal,
      to: 8,
    }).getBaseValue("string");
    const withdraw_bps = `${Number.parseInt(
      debouncedWithdrawPercent?.mul(100).getValue("string") || "10000",
    )}`;

    const quoteParams = isDeposit
      ? { type: "deposit" as const, amount }
      : { address, type: "withdraw" as const, withdraw_bps };

    const response = (await getSaverQuote({
      ...quoteParams,
      asset: asset.toString().toLowerCase(),
    })) as SaverQuoteResponse;

    setSaverQuoteData(response);
  }, [debouncedAmount, isDeposit, address, debouncedWithdrawPercent, asset]);

  useEffect(() => {
    getConfirmData();
  }, [getConfirmData]);

  const expectedOutputAmount = useMemo(
    () => SwapKitNumber.fromBigInt(BigInt(saverQuote?.expected_amount_out || 0), 8),
    [saverQuote?.expected_amount_out],
  );

  const slippage = SwapKitNumber.fromBigInt(
    BigInt(saverQuote?.fees?.total || "0"),
    BaseDecimal.THOR,
  );

  const { inputFee } = useNetworkFee({ inputAsset: asset, outputAsset: asset });

  const daysToBreakEven = useMemo(() => {
    const yearlyEarn = expectedOutputAmount.mul(apr || 0);
    const dailyEarn = yearlyEarn.mul(1 / 365);
    const amountToBreakEven = slippage.add(inputFee);
    const daysAmount = dailyEarn.gt(0) ? amountToBreakEven.div(dailyEarn) : 0;

    return Math.round(Number(daysAmount.toFixed(2)));
  }, [apr, expectedOutputAmount, inputFee, slippage]);

  return {
    slippage,
    getConfirmData,
    saverQuote,
    expectedOutputAmount,
    // THIS SHOULD BE FROM API
    networkFee: inputFee,
    daysToBreakEven,
  };
};
