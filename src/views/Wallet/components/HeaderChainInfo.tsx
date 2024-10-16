import { Text } from "@chakra-ui/react";
import type { Chain, ChainWallet } from "@swapkit/sdk";
import { WalletOption } from "@swapkit/sdk";
import { Box } from "components/Atomic";
import { PhraseModal } from "components/Modals/PhraseModal";
import { showInfoToast } from "components/Toast";
import { WalletIcon } from "components/WalletIcon/WalletIcon";
import { chainName } from "helpers/chainName";
import { t } from "i18next";
import { useCallback, useState } from "react";
import type { SupportedWalletOptions } from "store/thorswap/types";

type Props = {
  chain: Chain;
  // biome-ignore lint/correctness/noUndeclaredVariables:
  chainWallet: Maybe<ChainWallet<Chain>>;
  balance: string;
};

export const HeaderChainInfo = ({ chain, chainWallet, balance }: Props) => {
  const [isPhraseModalVisible, setIsPhraseModalVisible] = useState(false);

  const handleClosePhraseModal = () => {
    setIsPhraseModalVisible(false);
  };
  const handleClickWalletIcon = useCallback(async () => {
    if (chainWallet?.walletType === WalletOption.KEYSTORE) {
      setIsPhraseModalVisible(true);
    }
    const { getAddress } = await (await import("services/swapKit")).getSwapKitClient();

    if (chainWallet?.walletType === WalletOption.LEDGER) {
      showInfoToast(t("notification.verifyLedgerAddy"), getAddress(chain), {
        duration: 20 * 1000,
      });
    }
  }, [chainWallet?.walletType, chain]);

  return (
    <Box center className="space-x-1">
      {!!chainWallet && (
        <WalletIcon
          onClick={handleClickWalletIcon}
          size={16}
          walletType={chainWallet?.walletType as SupportedWalletOptions}
        />
      )}
      <Text>{chainName(chain, true)}</Text>

      {!!chainWallet && (
        <Text fontWeight="semibold" variant="primaryBtn">
          {balance}
        </Text>
      )}
      <PhraseModal isOpen={isPhraseModalVisible} onCancel={handleClosePhraseModal} />
    </Box>
  );
};
