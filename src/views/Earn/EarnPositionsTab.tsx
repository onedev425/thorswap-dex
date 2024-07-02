import type { AssetValue } from "@swapkit/sdk";
import { Box, Button } from "components/Atomic";
import { useWallet, useWalletConnectModal } from "context/wallet/hooks";
import { t } from "services/i18n";
import { EarnPositions } from "views/Earn/EarnPositions";
import type { SaverPosition } from "views/Earn/types";

type Props = {
  onWithdraw: (asset: AssetValue) => void;
  onDeposit: (asset: AssetValue) => void;
  positions: SaverPosition[];
  refreshPositions: () => void;
};

export const EarnPositionsTab = ({ onWithdraw, onDeposit, positions, refreshPositions }: Props) => {
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { hasWallet } = useWallet();

  return (
    <Box className="w-full self-stretch">
      {hasWallet ? (
        <EarnPositions
          depositAsset={onDeposit}
          positions={positions}
          refresh={refreshPositions}
          withdrawAsset={onWithdraw}
        />
      ) : (
        <Box center className="self-stretch w-full">
          <Button
            stretch
            className="mt-3 max-w-[460px] self-center"
            onClick={() => setIsConnectModalOpen(true)}
            size="lg"
            variant="fancy"
          >
            {t("common.connectWallet")}
          </Button>
        </Box>
      )}
    </Box>
  );
};
