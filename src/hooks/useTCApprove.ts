import { TransactionType } from "@swapkit/api";
import type { AssetValue } from "@swapkit/sdk";
import { Chain } from "@swapkit/sdk";
import { showErrorToast } from "components/Toast";
import { useWallet } from "context/wallet/hooks";
import { t } from "i18next";
import { useCallback, useMemo } from "react";
import { logException } from "services/logger";
import { useAppDispatch } from "store/store";
import { addTransaction, completeTransaction, updateTransaction } from "store/transactions/slice";
import { v4 } from "uuid";

export const useTCApprove = ({ asset }: { asset: AssetValue }) => {
  const { getWalletAddress } = useWallet();
  const appDispatch = useAppDispatch();
  const from = useMemo(() => getWalletAddress(asset.chain), [asset.chain, getWalletAddress]);

  const handleApprove = useCallback(async () => {
    if (from) {
      const id = v4();
      const inChain = asset.chain;
      const type =
        inChain === Chain.Ethereum
          ? TransactionType.ETH_APPROVAL
          : inChain === Chain.Avalanche
            ? TransactionType.AVAX_APPROVAL
            : TransactionType.BSC_APPROVAL;

      appDispatch(
        addTransaction({
          id,
          from,
          inChain,
          type,
          label: `${t("txManager.approve")} ${asset.ticker}`,
        }),
      );

      const { thorchain } = await (await import("services/swapKit")).getSwapKitClient();

      if (!thorchain) {
        throw new Error("Thorchain client not found");
      }

      try {
        const txid = await thorchain.approveAssetValue({
          assetValue: asset,
        });

        if (typeof txid === "string") {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error) {
        logException(error as Error);
        appDispatch(completeTransaction({ id, status: "error" }));
        showErrorToast(t("notification.approveFailed"), undefined, undefined, error as Error);
      }
    }
  }, [from, asset, appDispatch]);

  return handleApprove;
};
