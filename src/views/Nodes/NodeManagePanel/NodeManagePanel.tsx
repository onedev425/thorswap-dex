import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import { AssetIcon } from "components/AssetIcon";
import { Box, Button } from "components/Atomic";
import { PanelInput } from "components/PanelInput";
import { TabsSelect } from "components/TabsSelect";
import { RUNEAsset } from "helpers/assets";
import { useState } from "react";
import { t } from "services/i18n";
import { useNodeManager } from "views/Nodes/hooks/hooks";
import type { NodeManagePanelProps } from "views/Nodes/types";
import { BondActionType } from "views/Nodes/types";

export const NodeManagePanel = ({
  address,
  handleBondAction,
  skipWalletCheck,
}: NodeManagePanelProps) => {
  const [nodeAddress, setNodeAddress] = useState(address || "");
  const {
    tabs,
    handleComplete,
    activeTab,
    rawAmount,
    onAmountChange,
    onTabChange,
    isWalletConnected,
    setIsConnectModalOpen,
  } = useNodeManager({
    address: nodeAddress,
    handleBondAction,
    skipWalletCheck,
  });

  return (
    <Box col className="self-stretch gap-1">
      <TabsSelect onChange={onTabChange} tabs={tabs} value={activeTab.value} />

      {!address && (
        <PanelInput
          autoFocus
          stretch
          onChange={(e) => setNodeAddress(e.target.value)}
          placeholder="thor..."
          title={t("common.nodeAddress")}
          value={nodeAddress}
        />
      )}

      <Box
        className={classNames(
          "transition-all overflow-hidden",
          activeTab.value === BondActionType.Leave ? "max-h-[0px]" : "max-h-[86px]",
        )}
      >
        <PanelInput
          className="flex-1 overflow-hidden"
          onChange={onAmountChange}
          placeholder={t("common.amount")}
          suffix={
            <Box className="w-[84px] gap-x-2 pt-2">
              <Text textStyle="subtitle2">{RUNEAsset.ticker}</Text>
              <AssetIcon asset={RUNEAsset} size={26} />
            </Box>
          }
          title={
            activeTab.value === BondActionType.Bond
              ? t("views.nodes.bondAmount")
              : t("views.nodes.unbondAmount")
          }
          value={rawAmount}
        />
      </Box>

      <Box center className="w-full pt-5">
        <Button
          stretch
          onClick={isWalletConnected ? handleComplete : () => setIsConnectModalOpen(true)}
          size="lg"
          variant="fancy"
        >
          {isWalletConnected ? activeTab.label : t("common.connectWallet")}
        </Button>
      </Box>
    </Box>
  );
};
