import { WalletOption } from '@thorswap-lib/multichain-core';
import { SupportedChain } from '@thorswap-lib/types';
import { Box, Tooltip, Typography } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { PhraseModal } from 'components/Modals/PhraseModal';
import { showInfoToast } from 'components/Toast';
import { WalletIcon } from 'components/WalletIcon/WalletIcon';
import { chainName } from 'helpers/chainName';
import { useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { WalletHeaderActions } from 'views/Wallet/components/WalletHeaderActions';
import { useWalletChainActions } from 'views/Wallet/hooks';

export type ChainHeaderProps = {
  chain: SupportedChain;
  address: string;
  walletLoading: boolean;
  walletType: WalletOption;
};

export const ChainHeader = ({
  chain,
  address,
  walletType,
  walletLoading = false,
}: ChainHeaderProps) => {
  const { handleRefreshChain, handleWalletDisconnect } = useWalletChainActions(chain);

  const [isPhraseModalVisible, setIsPhraseModalVisible] = useState(false);

  const handleClosePhraseModal = () => {
    setIsPhraseModalVisible(false);
  };

  const handleClickWalletIcon = useCallback(async () => {
    if (walletType === WalletOption.KEYSTORE) {
      setIsPhraseModalVisible(true);
    }

    if (walletType === WalletOption.LEDGER && chain === 'THOR') {
      const addr = await multichain().thor.verifyLedgerAddress();

      showInfoToast(t('notification.verifyLedgerAddy'), addr, {
        duration: 20 * 1000,
      });
    }
  }, [walletType, chain]);

  const walletTooltip = useMemo(() => {
    if (walletType === WalletOption.KEYSTORE) {
      return t('views.walletModal.viewPhrase');
    }
    if (walletType === WalletOption.LEDGER) {
      return t('views.walletModal.verifyAddress');
    }

    return `${walletType} ${t('common.connected')}`;
  }, [walletType]);

  return (
    <Box className="px-2 py-1 bg-btn-light-tint dark:bg-btn-dark-tint" justify="between">
      <Box alignCenter>
        <HoverIcon
          iconName="refresh"
          onClick={handleRefreshChain}
          size={16}
          spin={walletLoading}
          tooltip={t('common.refresh')}
        />
        <Tooltip content={walletTooltip}>
          <WalletIcon onClick={handleClickWalletIcon} size={16} walletType={walletType} />
        </Tooltip>
        <Typography className="ml-1" variant="caption">
          {chainName(chain, true)}
        </Typography>
      </Box>

      <Box alignCenter>
        <WalletHeaderActions address={address} chain={chain} />
        <HoverIcon
          color="orange"
          iconName="disconnect"
          onClick={handleWalletDisconnect}
          size={16}
          tooltip={t('common.disconnect')}
        />
      </Box>

      <PhraseModal isOpen={isPhraseModalVisible} onCancel={handleClosePhraseModal} />
    </Box>
  );
};
