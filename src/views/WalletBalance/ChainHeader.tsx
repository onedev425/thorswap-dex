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
import { useAppDispatch } from 'store/store';
import { actions } from 'store/wallet/slice';
import { CopyAddress } from 'views/Wallet/components/CopyAddress';
import { GoToAccount } from 'views/Wallet/components/GoToAccount';
import { ShowQrCode } from 'views/Wallet/components/ShowQrCode';
import { useWalletChainActions } from 'views/Wallet/hooks';

export type ChainHeaderProps = {
  chain: SupportedChain;
  address: string;
  walletLoading: boolean;
  hasHiddenAssets: boolean;
  walletType: WalletOption;
};

export const ChainHeader = ({
  chain,
  address,
  walletType,
  hasHiddenAssets,
  walletLoading = false,
}: ChainHeaderProps) => {
  const appDispatch = useAppDispatch();
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

  const handleResetHiddenAssets = useCallback(() => {
    appDispatch(actions.clearChainHiddenAssets(chain));
  }, [appDispatch, chain]);

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
        <CopyAddress address={address} type="mini" />
        {hasHiddenAssets && (
          <HoverIcon
            color="secondary"
            iconName="eye"
            onClick={handleResetHiddenAssets}
            size={16}
            tooltip={t('views.walletModal.showHiddenAssets')}
          />
        )}
        <ShowQrCode address={address} chain={chain} />
        <GoToAccount address={address} chain={chain} />
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
