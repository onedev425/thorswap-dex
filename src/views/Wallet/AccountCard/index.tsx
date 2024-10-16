import { Text } from "@chakra-ui/react";
import type { Chain } from "@swapkit/sdk";
import { AssetValue } from "@swapkit/sdk";
import classNames from "classnames";
import { AssetIcon } from "components/AssetIcon";
import { Box, Card, useCollapse } from "components/Atomic";
import { maxHeightTransitionClass } from "components/Atomic/Collapse/Collapse";
import { CollapseChevron } from "components/Atomic/Collapse/CollapseChevron";
import { Scrollbar } from "components/Scrollbar";
import { borderHoverHighlightClass } from "components/constants";
import { useWalletDispatch } from "context/wallet/WalletProvider";
import { useFormatPrice } from "helpers/formatPrice";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "services/i18n";
import { getSendRoute, getSwapRoute } from "settings/router";
import { ViewMode } from "types/app";
import { AssetChart } from "views/Wallet/AssetChart";
import { ConnectionActions } from "views/Wallet/components/ConnectionActions";
import { CopyAddress } from "views/Wallet/components/CopyAddress";
import { HeaderChainInfo } from "views/Wallet/components/HeaderChainInfo";
import { ShowQrCode } from "views/Wallet/components/ShowQrCode";
import { WalletHeaderActions } from "views/Wallet/components/WalletHeaderActions";

import { useAccountData, useWalletChainActions } from "../hooks";

import { AccountCardButton } from "./AccountCardButton";
import { ChainInfo } from "./ChainInfo";

type Props = {
  chain: Chain;
  thornames: string[];
};

export const AccountCard = memo(({ thornames, chain }: Props) => {
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse();
  const formatPrice = useFormatPrice();
  const navigate = useNavigate();
  const walletDispatch = useWalletDispatch();

  const {
    sigAssetPriceInfo,
    accountBalance,
    chainAddress,
    chainInfo,
    priceData,
    setIsConnectModalOpen,
    chainWallet,
    chainWalletLoading,
  } = useAccountData(chain);

  const { handleRefreshChain } = useWalletChainActions(chain);
  const sigAsset = AssetValue.from({ chain });

  const toggleConnect = useCallback(() => {
    if (chainAddress) {
      walletDispatch({ type: "disconnectByChain", payload: chain });
    } else {
      setIsConnectModalOpen(true);
    }
  }, [chain, chainAddress, setIsConnectModalOpen, walletDispatch]);

  return (
    <Card className={classNames("overflow-hidden", borderHoverHighlightClass)}>
      <Box col className="w-full">
        <Box
          row
          className="pb-4 border-0 border-b-2 border-solid border-light-gray-light dark:border-dark-border-primary"
          justify="between"
        >
          <HeaderChainInfo balance={accountBalance} chain={chain} chainWallet={chainWallet} />

          <ConnectionActions
            handleRefreshChain={handleRefreshChain}
            isConnected={!!chainAddress}
            isLoading={!!chainWalletLoading}
            toggleConnect={toggleConnect}
          />
        </Box>

        <Box alignCenter className="mt-3" justify="between">
          <Box>
            <AssetIcon hasShadow asset={sigAsset} size={40} />
            <Box col className="ml-2">
              <Text>{sigAsset.ticker}</Text>
              <Text fontWeight="medium" textStyle="caption-xs" variant="secondary">
                {sigAsset.type}
              </Text>
            </Box>
          </Box>

          {chainAddress && (
            <Box alignCenter>
              <Box col>
                <Box alignCenter row>
                  {thornames.length > 0 && (
                    <Box onClick={toggle}>
                      <CollapseChevron isActive={isActive} />
                    </Box>
                  )}
                </Box>

                <div className={maxHeightTransitionClass} ref={contentRef} style={maxHeightStyle}>
                  <Box col align="start">
                    {thornames.map((address) => (
                      <CopyAddress address={address} key={address} type="full" />
                    ))}
                  </Box>
                </div>
              </Box>

              <WalletHeaderActions address={chainAddress} chain={chain} />
            </Box>
          )}
        </Box>

        <Box center col className="mt-2">
          <Box alignCenter flex={1} justify="between">
            <Text fontWeight="semibold" textStyle="h3">
              {formatPrice(sigAssetPriceInfo?.price_usd)}
            </Text>
          </Box>

          <Text
            fontWeight="semibold"
            textStyle="caption"
            variant={
              (sigAssetPriceInfo?.cg?.price_change_percentage_24h_usd || 0) >= 0 ? "green" : "red"
            }
          >
            {sigAssetPriceInfo?.cg?.price_change_percentage_24h_usd?.toFixed(2)}%
          </Text>
        </Box>

        <AssetChart
          asset={sigAsset}
          mode={ViewMode.CARD}
          sparkline={sigAssetPriceInfo?.cg?.sparkline_in_7d}
        />

        <Box
          center
          className="pb-4 border-0 border-b-2 border-solid gap-x-6 border-light-gray-light dark:border-dark-border-primary"
        >
          <AccountCardButton
            className="rotate-180"
            icon="receive"
            label={t("common.send")}
            onClick={() => navigate(getSendRoute(sigAsset))}
          />

          <ShowQrCode
            address={chainAddress}
            chain={chain}
            openComponent={
              <AccountCardButton
                disabled={!chainAddress}
                icon="receive"
                label={t("common.receive")}
                tooltip={
                  chainAddress ? t("views.wallet.showQRCode") : t("views.walletModal.notConnected")
                }
              />
            }
          />

          <AccountCardButton
            icon="swap"
            label={t("common.swap")}
            onClick={() => navigate(getSwapRoute(sigAsset))}
          />
        </Box>

        <Box className="h-24 md:h-36">
          {chainInfo.length > 0 ? (
            <Box col className="!-mb-6" flex={1}>
              <Scrollbar>
                {chainInfo.map((info) => (
                  <ChainInfo assetValue={info} key={info.ticker} priceData={priceData} />
                ))}
              </Scrollbar>
            </Box>
          ) : (
            <Box center flex={1}>
              <Text textStyle="subtitle2" variant="secondary">
                {t("views.wallet.noDataToShow")}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
});
