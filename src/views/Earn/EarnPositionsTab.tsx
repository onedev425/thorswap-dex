import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Box, Button } from 'components/Atomic';
import { hasConnectedWallet } from 'helpers/wallet';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';
import { EarnPositions } from 'views/Earn/EarnPositions';
import { SaverPosition } from 'views/Earn/types';

type Props = {
  onWithdraw: (asset: AssetEntity) => void;
  onDeposit: (asset: AssetEntity) => void;
  positions: SaverPosition[];
  refreshPositions: () => void;
};

export const EarnPositionsTab = ({ onWithdraw, onDeposit, positions, refreshPositions }: Props) => {
  const { wallet, setIsConnectModalOpen } = useWallet();
  const isWalletConnected = useMemo(() => hasConnectedWallet(wallet), [wallet]);

  return (
    <Box className="w-full self-stretch">
      {isWalletConnected ? (
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
            {t('common.connectWallet')}
          </Button>
        </Box>
      )}
    </Box>
  );
};
