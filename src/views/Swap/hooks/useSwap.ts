import type { QuoteRoute } from "@swapkit/api";
import type { AssetValue } from "@swapkit/sdk";
import { ProviderName, QuoteMode } from "@swapkit/sdk";
import { showErrorToast } from "components/Toast";
import { useWallet } from "context/wallet/hooks";
import { translateErrorMsg } from "helpers/error";
import { useCallback } from "react";
import { t } from "services/i18n";
import { logEvent, logException } from "services/logger";
import { IS_DEV_API, IS_LEDGER_LIVE } from "settings/config";
import { useApp } from "store/app/hooks";
import { useAppDispatch } from "store/store";
import { addTransaction, completeTransaction, updateTransaction } from "store/transactions/slice";
import { TransactionType } from "store/transactions/types";
import { v4 } from "uuid";

import { ledgerLiveSwap } from "../../../../ledgerLive/wallet/swap";

type SwapParams = {
  route?: QuoteRoute;
  quoteMode: QuoteMode;
  recipient: string;
  inputAsset: AssetValue;
  outputAsset: AssetValue;
  quoteId?: string;
  streamSwap?: boolean;
};

const quoteModeToTransactionType = {
  [QuoteMode.AVAX_TO_AVAX]: TransactionType.SWAP_AVAX_TO_AVAX,
  [QuoteMode.AVAX_TO_BSC]: TransactionType.SWAP_AVAX_TO_TC,
  [QuoteMode.AVAX_TO_ETH]: TransactionType.SWAP_AVAX_TO_TC,
  [QuoteMode.AVAX_TO_TC_SUPPORTED]: TransactionType.SWAP_AVAX_TO_TC,
  [QuoteMode.BSC_TO_AVAX]: TransactionType.BSC_TRANSFER_TO_TC,
  [QuoteMode.BSC_TO_BSC]: TransactionType.SWAP_BSC_TO_BSC,
  [QuoteMode.BSC_TO_ETH]: TransactionType.SWAP_BSC_TO_ETH,
  [QuoteMode.BSC_TO_TC_SUPPORTED]: TransactionType.SWAP_BSC_TO_TC,
  [QuoteMode.ETH_TO_AVAX]: TransactionType.SWAP_ETH_TO_AVAX,
  [QuoteMode.ETH_TO_BSC]: TransactionType.SWAP_ETH_TO_TC,
  [QuoteMode.ETH_TO_ETH]: TransactionType.SWAP_ETH_TO_ETH,
  [QuoteMode.ETH_TO_TC_SUPPORTED]: TransactionType.SWAP_ETH_TO_TC,
  [QuoteMode.TC_SUPPORTED_TO_AVAX]: TransactionType.SWAP_TC_TO_AVAX,
  [QuoteMode.TC_SUPPORTED_TO_BSC]: TransactionType.SWAP_TC_TO_BSC,
  [QuoteMode.TC_SUPPORTED_TO_ETH]: TransactionType.SWAP_TC_TO_ETH,
  [QuoteMode.TC_SUPPORTED_TO_TC_SUPPORTED]: TransactionType.SWAP_TC_TO_TC,
} as const;

export const useSwap = ({
  recipient = "",
  inputAsset,
  outputAsset,
  route,
  quoteId,
  streamSwap,
}: SwapParams) => {
  const appDispatch = useAppDispatch();
  const { feeOptionType: feeOptionKey } = useApp();
  const { wallet } = useWallet();

  const handleSwap = useCallback(async () => {
    const id = v4();
    try {
      const from = wallet?.[inputAsset.chain as keyof typeof wallet]?.address;
      const isChainflip = route?.providers?.includes("CHAINFLIP");

      if (route) {
        if (!from) throw new Error("No address found");

        const label = `${inputAsset.toSignificant(6)} ${
          inputAsset.isSynthetic ? "Synth " : ""
        }${inputAsset.ticker} → ${outputAsset.toSignificant(6)} ${
          outputAsset.isSynthetic ? "Synth " : ""
        }${outputAsset.ticker}`;

        const initLabel = isChainflip ? t("txManager.preparingTransaction") : label;

        const { swap, validateAddress } = await (
          await import("services/swapKit")
        ).getSwapKitClient();

        const validAddress = validateAddress({
          chain: outputAsset.chain,
          address: recipient,
        });
        if (typeof validAddress === "boolean" && !validAddress) {
          throw new Error("Invalid recipient address");
        }

        const swapMethod = IS_LEDGER_LIVE ? ledgerLiveSwap : swap;
        const isV1Aggregator = ![
          ProviderName.THORCHAIN_STREAMING,
          ProviderName.THORCHAIN,
          ProviderName.MAYACHAIN,
          ProviderName.MAYACHAIN_STREAMING,
          ProviderName.CHAINFLIP,
        ].includes(route.providers[0] as ProviderName);

        appDispatch(
          addTransaction({
            id,
            label: initLabel,
            from,
            inChain: inputAsset.chain,
            type: quoteModeToTransactionType[
              route.meta?.quoteMode ||
                (QuoteMode.TC_SUPPORTED_TO_TC_SUPPORTED as QuoteMode.ETH_TO_ETH)
            ],
            quoteId,
            sellAmount: inputAsset.toSignificant(),
            sellAmountNormalized: inputAsset.toSignificant(6),
            recipient: recipient || from,
            streamingSwap: streamSwap,
          }),
        );

        try {
          const txid = await swapMethod({
            pluginName: !IS_DEV_API && isV1Aggregator ? "thorchain" : undefined,
            feeOptionKey,
            recipient,
            route,
            // @ts-expect-error TODO support stream swap with apiv2
            streamSwap,
            wallet,
          });
          logEvent("swap", {
            quoteId,
            expectedVolume: route.expectedOutputUSD,
            minVolume: route.expectedOutputMaxSlippageUSD,
            input: inputAsset.toString(),
            output: outputAsset.toString(),
          });

          if (typeof txid === "string") {
            const timestamp = new Date();
            appDispatch(
              updateTransaction({
                label,
                id,
                txid,
                quoteId,
                route,
                timestamp,
                advancedTracker: isChainflip,
              }),
            );
          } else {
            appDispatch(completeTransaction({ id, status: "error" }));
            showErrorToast(t("notification.submitFail"), JSON.stringify(txid));
          }
        } catch (error) {
          logException(error as Error);
          appDispatch(completeTransaction({ id, status: "error" }));
          const userCancelled =
            (error as Todo)?.code === 4001 || error?.toString().includes("4001");

          if (!userCancelled) {
            logEvent("swap_failed", {
              error,
              input: inputAsset.toString(),
              output: outputAsset.toString(),
            });
          }

          showErrorToast(
            t("notification.submitFail"),
            userCancelled ? t("notification.cancelledByUser") : error?.toString(),
            undefined,
            error as Error,
          );
        }
      }
    } catch (error) {
      logEvent("swap_failed", {
        error,
        input: inputAsset.toString(),
        output: outputAsset.toString(),
      });
      logException(error as Error);
      const description = translateErrorMsg((error as Todo)?.toString());
      appDispatch(completeTransaction({ id, status: "error" }));

      showErrorToast(
        t("notification.submitFail"),
        description.includes("Object") ? "" : description,
        undefined,
        error as Error,
      );
    }
  }, [
    wallet,
    inputAsset,
    route,
    outputAsset,
    recipient,
    appDispatch,
    quoteId,
    streamSwap,
    feeOptionKey,
  ]);

  return handleSwap;
};
