import { Text } from "@chakra-ui/react";
import type { Chain } from "@swapkit/sdk";
import { AssetValue, WalletOption, isGasAsset } from "@swapkit/sdk";
import classNames from "classnames";
import { AssetIcon } from "components/AssetIcon";
import { Box, Button, Icon } from "components/Atomic";
import { Scrollbar } from "components/Scrollbar";
import { baseBgHoverClass } from "components/constants";
import { useWalletDispatch } from "context/wallet/WalletProvider";
import { useWallet } from "context/wallet/hooks";
import { useWalletDrawer } from "hooks/useWalletDrawer";
import type { MouseEventHandler } from "react";
import { memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "services/i18n";
import { SORTED_CHAINS } from "settings/chain";
import { IS_LEDGER_LIVE } from "settings/config";
import { getSendRoute, getSwapRoute } from "settings/router";
import type { SupportedWalletOptions } from "store/thorswap/types";

import { isLedgerLiveSupportedInputAsset } from "../../../ledgerLive/wallet/LedgerLive";

import { ChainHeader } from "./ChainHeader";
import { WalletDrawer } from "./WalletDrawer";
import { WalletHeader } from "./WalletHeader";

type ChainBalanceProps = {
  chain: Chain;
  address: string;
  loading: boolean;
  walletType: SupportedWalletOptions;
  balance: AssetValue[];
};

const ChainBalance = memo(({ chain, address, loading, walletType, balance }: ChainBalanceProps) => {
  const navigate = useNavigate();
  const { close } = useWalletDrawer();
  const walletDispatch = useWalletDispatch();

  const walletBalance = useMemo(
    () => [...balance, ...(balance.length === 0 ? [AssetValue.fromChainOrSignature(chain)] : [])],
    [balance, chain],
  );

  const handleNavigate = useCallback(
    (route: string): MouseEventHandler<HTMLDivElement | HTMLButtonElement> =>
      (event) => {
        event.stopPropagation();
        close();
        navigate(route);
      },
    [close, navigate],
  );

  const hideAsset = useCallback(
    (chain: Chain, assetValue: AssetValue): MouseEventHandler<HTMLDivElement | HTMLButtonElement> =>
      (event) => {
        event.stopPropagation();
        walletDispatch({
          type: "hideAsset",
          payload: { chain, address: assetValue.toString() },
        });
      },
    [walletDispatch],
  );

  return (
    <Box col className="mt-2" key={chain.toString()}>
      <ChainHeader
        address={address}
        chain={chain}
        walletLoading={loading}
        walletType={walletType}
      />

      {walletBalance.map((assetValue) => (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          key={assetValue.symbol}
          onClick={
            !IS_LEDGER_LIVE || isLedgerLiveSupportedInputAsset(assetValue)
              ? handleNavigate(getSwapRoute(assetValue))
              : undefined
          }
        >
          <Box
            alignCenter
            className={classNames(
              "p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary !bg-opacity-80",
              `${
                !IS_LEDGER_LIVE || isLedgerLiveSupportedInputAsset(assetValue)
                  ? "cursor-pointer"
                  : ""
              }`,
              !IS_LEDGER_LIVE || isLedgerLiveSupportedInputAsset(assetValue)
                ? baseBgHoverClass
                : "",
            )}
            justify="between"
          >
            <Box alignCenter row className="flex-1">
              <AssetIcon asset={assetValue} size={36} />
              <Box col className="pl-2 w-[80px]">
                <Text>{assetValue.ticker}</Text>
                <Text fontWeight="medium" textStyle="caption-xs" variant="secondary">
                  {assetValue.type}
                </Text>
              </Box>
              <Text variant="primary">{assetValue.toCurrency("", { decimal: 8 })}</Text>
            </Box>

            <Box row className="space-x-1">
              {!isGasAsset(assetValue) && (
                <Button
                  className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                  leftIcon={<Icon color="primaryBtn" name="eyeSlash" size={16} />}
                  onClick={hideAsset(chain, assetValue)}
                  tooltip={t("common.hide")}
                  variant="tint"
                />
              )}
              {!IS_LEDGER_LIVE && (
                <Button
                  className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                  leftIcon={<Icon color="primaryBtn" name="send" size={16} />}
                  onClick={handleNavigate(getSendRoute(assetValue))}
                  tooltip={t("common.send")}
                  variant="tint"
                />
              )}
            </Box>
          </Box>
        </div>
      ))}
    </Box>
  );
});

export const WalletBalance = () => {
  const { chainLoading, hasWallet, wallet } = useWallet();

  if (!hasWallet) return null;

  return (
    <WalletDrawer>
      <Scrollbar>
        <WalletHeader />
        <Box col>
          {SORTED_CHAINS.map((chain) => {
            const chainWallet = wallet?.[chain as keyof typeof wallet];

            return chainWallet?.address ? (
              <ChainBalance
                address={chainWallet?.address ?? ""}
                balance={chainWallet?.balance ?? []}
                chain={chain}
                key={chain}
                loading={!!chainLoading[chain as keyof typeof chainLoading]}
                walletType={
                  (chainWallet?.walletType ?? WalletOption.KEYSTORE) as SupportedWalletOptions
                }
              />
            ) : null;
          })}
        </Box>
      </Scrollbar>
    </WalletDrawer>
  );
};
