import { Text } from "@chakra-ui/react";
import { type Chain, WalletOption } from "@swapkit/sdk";
import { Box } from "components/Atomic";
import { HoverIcon } from "components/HoverIcon";
import { PhraseModal } from "components/Modals/PhraseModal";
import { showInfoToast } from "components/Toast";
import { WalletIcon } from "components/WalletIcon/WalletIcon";
import { chainName } from "helpers/chainName";
import { memo, useCallback, useState } from "react";
import { t } from "services/i18n";
import { IS_LEDGER_LIVE } from "settings/config";
import type { SupportedWalletOptions } from "store/thorswap/types";
import { WalletHeaderActions } from "views/Wallet/components/WalletHeaderActions";
import { useWalletChainActions } from "views/Wallet/hooks";

export type ChainHeaderProps = {
  chain: Chain;
  address: string;
  walletLoading: boolean;
  walletType: SupportedWalletOptions;
};

export const ChainHeader = memo(
  ({ chain, address, walletType, walletLoading = false }: ChainHeaderProps) => {
    const { handleRefreshChain, handleWalletDisconnect } = useWalletChainActions(chain);
    const [isPhraseModalVisible, setIsPhraseModalVisible] = useState(false);

    const handleClosePhraseModal = useCallback(() => {
      setIsPhraseModalVisible(false);
    }, []);

    const handleClickWalletIcon = useCallback(async () => {
      if (walletType === WalletOption.KEYSTORE) {
        setIsPhraseModalVisible(true);
      }
      const { getAddress } = await (await import("services/swapKit")).getSwapKitClient();

      if (walletType === WalletOption.LEDGER && !IS_LEDGER_LIVE) {
        showInfoToast(t("notification.verifyLedgerAddy"), getAddress(chain), {
          duration: 20 * 1000,
        });
      }
    }, [walletType, chain]);

    return (
      <Box className="px-2 py-1 bg-btn-light-tint dark:bg-btn-dark-tint" justify="between">
        <Box alignCenter>
          <HoverIcon
            iconName="refresh"
            onClick={handleRefreshChain}
            size={16}
            spin={walletLoading}
            tooltip={t("common.refresh")}
          />

          <WalletIcon
            onClick={handleClickWalletIcon}
            size={16}
            walletType={walletType as SupportedWalletOptions}
          />

          <Text className="ml-1" textStyle="caption">
            {chainName(chain, true)}
          </Text>
        </Box>

        <Box alignCenter className="ph-no-capture">
          <WalletHeaderActions address={address} chain={chain} />
          <HoverIcon
            color="orange"
            iconName="disconnect"
            onClick={handleWalletDisconnect}
            size={16}
            tooltip={t("common.disconnect")}
          />
        </Box>

        <PhraseModal isOpen={isPhraseModalVisible} onCancel={handleClosePhraseModal} />
      </Box>
    );
  },
);
