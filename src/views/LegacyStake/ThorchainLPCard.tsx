import { Text } from "@chakra-ui/react";
import { AssetValue, Chain } from "@swapkit/sdk";
import classNames from "classnames";
import { AssetLpIcon } from "components/AssetIcon";
import { Box, Button, Card, Link } from "components/Atomic";
import { borderHoverHighlightClass } from "components/constants";
import { useWallet, useWalletConnectModal } from "context/wallet/hooks";
import { useThorAPR } from "hooks/useThorAPR";
import { useMemo } from "react";
import { t } from "services/i18n";
import { getAddLiquidityRoute, getWithdrawRoute } from "settings/router";

import { tcFarmData } from "./farmData";

export const ThorchainLPCard = () => {
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { getWalletAddress } = useWallet();
  const ethAddr = useMemo(() => getWalletAddress(Chain.Ethereum), [getWalletAddress]);
  const withdrawRouter = getWithdrawRoute(AssetValue.fromChainOrSignature("ETH.THOR"));
  const thorAPR = useThorAPR();
  const liquidityRouter = getAddLiquidityRoute(AssetValue.fromChainOrSignature("ETH.THOR"));

  return (
    <Box col className="flex-1 !min-w-[360px] lg:!max-w-[50%]">
      <Box className="w-full h-full min-h-[436px] relative mt-14">
        <Card className={classNames("flex-col flex-1", borderHoverHighlightClass)}>
          <div className="flex justify-center absolute m-auto left-0 right-0 top-[-28px]">
            <AssetLpIcon
              hasShadow
              inline
              asset1={tcFarmData.assets[0]}
              asset2={tcFarmData.assets[1]}
              size="big"
            />
          </div>

          <Box center className="mt-8">
            <Text className="mr-2" textStyle="h4">
              THOR-RUNE LP
            </Text>
          </Box>

          <Box className="flex-row justify-between">
            <Box col className="p-4">
              <Text
                fontWeight="bold"
                textStyle="caption-xs"
                textTransform="uppercase"
                variant="secondary"
              >
                {t("common.exchange")}
              </Text>
              <Text fontWeight="bold" textStyle="body" variant="primary">
                {t("common.THORSwap")}
              </Text>
            </Box>
            <Box col className="p-4">
              <Text
                className="text-right"
                fontWeight="bold"
                textStyle="caption-xs"
                variant="secondary"
              >
                {t("common.APR")}
              </Text>

              <Text className="text-right" fontWeight="bold" textStyle="body" variant="green">
                {thorAPR}%
              </Text>
            </Box>
          </Box>
          <Box className="flex-col px-4">
            <Text>{t("views.staking.tcStakingDesc")}</Text>
          </Box>
          <Box alignCenter className="flex-col-reverse flex-grow w-full mt-4">
            {ethAddr ? (
              <Box alignCenter row className="self-stretch gap-2">
                <Link className="flex-1" to={liquidityRouter}>
                  <Button stretch variant="primary">
                    {t("common.deposit")}
                  </Button>
                </Link>
                <Link className="flex-1" to={withdrawRouter}>
                  <Button stretch variant="secondary">
                    {t("common.withdraw")}
                  </Button>
                </Link>
              </Box>
            ) : (
              <Button stretch onClick={() => setIsConnectModalOpen(true)} size="lg" variant="fancy">
                {t("common.connectWallet")}
              </Button>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};
