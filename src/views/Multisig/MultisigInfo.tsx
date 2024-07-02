import { Text } from "@chakra-ui/react";
import { Chain } from "@swapkit/sdk";
import { Box, Button, Icon, Link } from "components/Atomic";
import { InfoTable } from "components/InfoTable";
import { Confirm } from "components/Modals/Confirm";
import { PanelView } from "components/PanelView";
import { ViewHeader } from "components/ViewHeader";
import { useCallback, useEffect, useState } from "react";
import { t } from "services/i18n";
import { ROUTES } from "settings/router";
import { useMultisig } from "store/multisig/hooks";
import { useAppSelector } from "store/store";
import { InactiveAccountWarning } from "views/Multisig/components/InactiveAccountWarning";
import { MultisigExport } from "views/Multisig/components/MultisigExport/MultisigExport";
import { useMultisigWalletInfo } from "views/Multisig/hooks";

export const MultisigInfo = () => {
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const info = useMultisigWalletInfo();
  const { loadingBalances, name, address } = useAppSelector(({ multisig }) => multisig);
  const { loadBalances, clearMultisigWallet } = useMultisig();
  const [accountUrl, setAccountUrl] = useState("");

  const handleClearWallet = useCallback(() => {
    clearMultisigWallet();
    setIsConfirmVisible(false);
  }, [clearMultisigWallet, setIsConfirmVisible]);

  useEffect(() => {
    import("services/swapKit")
      .then(({ getSwapKitClient }) => getSwapKitClient())
      .then(({ getExplorerAddressUrl }) =>
        setAccountUrl(getExplorerAddressUrl({ chain: Chain.THORChain, address }) || ""),
      );
  }, [address]);

  return (
    <PanelView
      header={
        <ViewHeader
          actionsComponent={
            <Box className="gap-2">
              <Button
                className="px-3"
                leftIcon={
                  <Icon color="primaryBtn" name="refresh" size={16} spin={loadingBalances} />
                }
                onClick={loadBalances}
                tooltip={t("common.refresh")}
                tooltipPlacement="bottom"
                variant="borderlessPrimary"
              />
              <Button
                className="px-3"
                leftIcon={<Icon color="orange" name="disconnect" size={16} />}
                onClick={() => setIsConfirmVisible(true)}
                tooltip={t("views.multisig.disconnect")}
                tooltipPlacement="left"
                variant="borderlessWarn"
              />
            </Box>
          }
          title={t("views.multisig.thorSafeWallet")}
        />
      }
      title={t("views.multisig.thorSafeWallet")}
    >
      <Box col className="gap-5 self-stretch" flex={1}>
        <Box alignCenter row className="mx-1 gap-2" justify="between">
          <Text textStyle="subtitle2">{name || "Your THORSafe"}</Text>
          <Box className="gap-2">
            <MultisigExport />
            <Link to={accountUrl}>
              <Button
                rightIcon={<Icon name="external" size={18} />}
                tooltip={t("views.wallet.goToAccount")}
                variant="tint"
              />
            </Link>
          </Box>
        </Box>
        <InfoTable horizontalInset items={info} size="lg" />

        <InactiveAccountWarning />

        <Box align="end" className="mt-8" flex={1}>
          <Link className="flex-1" to={ROUTES.TxBuilder}>
            <Button stretch onClick={() => undefined} variant="primary">
              {t("views.multisig.createNewTransaction")}
            </Button>
          </Link>
        </Box>
      </Box>

      <Confirm
        description={t("views.multisig.confirmWalletRemoval")}
        isOpened={isConfirmVisible}
        onCancel={() => setIsConfirmVisible(false)}
        onConfirm={handleClearWallet}
        title={t("common.pleaseConfirm")}
      />
    </PanelView>
  );
};
