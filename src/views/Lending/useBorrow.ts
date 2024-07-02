import { AssetValue, Chain, SwapKitNumber } from "@swapkit/sdk";
import { useWallet } from "context/wallet/hooks";
import { useDebouncedValue } from "hooks/useDebouncedValue";
import { useVTHORBalance } from "hooks/useHasVTHOR";
import { useStreamTxToggle } from "hooks/useStreamTxToggle";
import { useEffect, useMemo } from "react";
import { useGetBorrowQuoteQuery } from "store/thorswap/api";

interface UseBorrowProps {
  recipientAddress: string;
  senderAddress: string;
  assetIn: AssetValue;
  assetOut: AssetValue;
  amount: SwapKitNumber;
  slippage: number;
  estimatedLoanSizeUsd: number;
}

export const useBorrow = ({
  recipientAddress,
  senderAddress,
  assetIn,
  assetOut,
  amount,
  slippage,
  estimatedLoanSizeUsd,
}: UseBorrowProps) => {
  const amountString = amount.gte(0) ? amount.toSignificant(8) : "0";
  const debouncedAmount = useDebouncedValue(amountString);
  const debouncedSlippage = useDebouncedValue(slippage);

  const { getWalletAddress } = useWallet();
  const ethAddress = useMemo(() => getWalletAddress(Chain.Ethereum), [getWalletAddress]);
  const VTHORBalance = useVTHORBalance(ethAddress);

  const affiliateBasisPoints = useMemo(
    () => getBasisPoints({ VTHORBalance, loanSizeUsd: estimatedLoanSizeUsd }),
    [VTHORBalance, estimatedLoanSizeUsd],
  );

  const {
    currentData: data,
    error,
    isFetching,
  } = useGetBorrowQuoteQuery(
    {
      affiliateBasisPoints,
      assetIn: assetIn.toString(),
      assetOut: assetOut.toString(),
      amount: debouncedAmount,
      slippage: debouncedSlippage.toString(),
      senderAddress,
      recipientAddress,
    },
    { skip: amount.lte(0), refetchOnMountOrArgChange: true },
  );

  const { canStream, toggleStream, stream } = useStreamTxToggle(
    data?.streamingSwap?.memo || data?.calldata?.memo,
  );

  const borrowData = useMemo(() => {
    if (stream && data?.streamingSwap) {
      return data.streamingSwap;
    }

    return data;
  }, [data, stream]);

  const expectedOutput = useMemo(() => {
    return new SwapKitNumber({ value: borrowData?.expectedOutput || 0, decimal: assetOut.decimal });
  }, [assetOut.decimal, borrowData?.expectedOutput]);

  const expectedOutputAssetValue = useMemo(() => {
    return AssetValue.fromStringSync(assetOut.toString(), borrowData?.expectedOutput);
  }, [assetOut, borrowData?.expectedOutput]);

  const expectedOutputMaxSlippage = useMemo(() => {
    return new SwapKitNumber({
      value: borrowData?.expectedOutputMaxSlippage || 0,
      decimal: assetOut.decimal,
    });
  }, [assetOut.decimal, borrowData?.expectedOutputMaxSlippage]);

  const expectedDebt = useMemo(() => {
    return new SwapKitNumber({ value: borrowData?.expectedDebtIssued || 0, decimal: 8 });
  }, [borrowData?.expectedDebtIssued]);

  const slippageAmount = useMemo(() => {
    return expectedOutput.sub(expectedOutputMaxSlippage);
  }, [expectedOutput, expectedOutputMaxSlippage]);

  const slippageAmountUsd = useMemo(() => {
    return new SwapKitNumber({ value: borrowData?.expectedOutputUSD || 0, decimal: 8 }).sub(
      new SwapKitNumber({ value: borrowData?.expectedOutputMaxSlippageUSD || 0, decimal: 8 }),
    );
  }, [borrowData?.expectedOutputMaxSlippageUSD, borrowData?.expectedOutputUSD]);

  const collateralAmount = useMemo(() => {
    return new SwapKitNumber({
      value: borrowData?.expectedCollateralDeposited || 0,
      decimal: assetIn.decimal,
    });
  }, [assetIn.decimal, borrowData?.expectedCollateralDeposited]);

  const totalFeeUsd = useMemo(() => {
    const fees = borrowData?.fees.THOR;
    const outboundFees = fees?.find((fee) => fee.type === "outbound");

    // extracting affiliate fee from total fee - it has its own section in the UI
    const totalFeeNum = (outboundFees?.totalFeeUSD || 0) - (outboundFees?.affiliateFeeUSD || 0);

    return new SwapKitNumber({ value: totalFeeNum, decimal: 8 });
  }, [borrowData?.fees.THOR]);

  const exchangeFeeUsd = useMemo(() => {
    const fees = borrowData?.fees.THOR;
    const outboundFees = fees?.find((fee) => fee.type === "outbound");

    return new SwapKitNumber({ value: outboundFees?.affiliateFeeUSD || 0, decimal: 8 });
  }, [borrowData?.fees.THOR]);

  useEffect(() => {
    toggleStream(!!assetIn.toString() && !!data?.streamingSwap);
  }, [assetIn, data?.streamingSwap, toggleStream]);

  const borrowSlippage = useMemo(() => {
    if (!data) return 0;

    const expectedDebtNum = expectedDebt.getValue("number");
    const expectedOutputUSD = expectedOutput.getValue("number");

    const slippagePercent =
      // does not account for exchange fee
      ((expectedDebtNum - expectedOutputUSD - exchangeFeeUsd.getValue("number")) /
        expectedOutputUSD) *
      100;

    return slippagePercent;
  }, [data, exchangeFeeUsd, expectedDebt, expectedOutput]);

  return {
    collateralAmount,
    expectedDebt,
    expectedOutput,
    expectedOutputMaxSlippage,
    hasError: !!error,
    borrowQuote: data,
    slippageAmount,
    slippageAmountUsd,
    totalFeeUsd,
    isFetching,
    toggleStream,
    stream,
    canStream,
    expectedOutputAssetValue,
    borrowSlippage,
    exchangeFeeUsd,
  };
};

const getBasisPoints = ({
  VTHORBalance,
  loanSizeUsd,
}: {
  VTHORBalance: SwapKitNumber;
  loanSizeUsd: number;
}) => {
  // edge cases - no need to calculate
  if (loanSizeUsd < 100 || VTHORBalance.gte(500_000)) return "0";

  // default basis points
  let basisPoints = 100;

  // lower loan size basis points
  if (loanSizeUsd > 25_000) basisPoints -= 20;
  if (loanSizeUsd > 100_000) basisPoints -= 30;
  if (loanSizeUsd > 250_000) basisPoints -= 40;
  if (loanSizeUsd > 500_000) basisPoints -= 50;

  // lower affiliate basis points based on VTHOR balance
  if (VTHORBalance.gte(1_000)) basisPoints -= 20;
  if (VTHORBalance.gte(10_000)) basisPoints -= 30;
  if (VTHORBalance.gte(100_000)) basisPoints -= 40;

  return `${Math.floor(basisPoints)}`;
};
