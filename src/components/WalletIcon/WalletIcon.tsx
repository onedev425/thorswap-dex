import { WalletOption } from '@swapkit/core';
import type { IconName } from 'components/Atomic';
import { Box, Icon, Tooltip } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { WalletNameByWalletOption } from 'components/Modals/ConnectWalletModal/types';
import { t } from 'services/i18n';
import { IS_LEDGER_LIVE } from 'settings/config';

type Props = {
  className?: string;
  walletType?: WalletOption;
  size?: number;
  onClick?: () => void;
  tooltipDisabled?: boolean;
};

const walletIcons: Record<WalletOption, IconName> = {
  [WalletOption.BRAVE]: 'brave',
  [WalletOption.METAMASK]: 'metamask',
  [WalletOption.TRUSTWALLET_WEB]: 'trustWallet',
  [WalletOption.COINBASE_WEB]: 'coinbaseWallet',
  [WalletOption.COINBASE_MOBILE]: 'coinbaseWallet',
  [WalletOption.LEDGER]: 'ledger',
  // [WalletOption.LEDGER_LIVE]: 'ledger',
  [WalletOption.KEEPKEY]: 'keepkey',
  [WalletOption.KEYSTORE]: 'keystore',
  [WalletOption.WALLETCONNECT]: 'walletConnect',
  [WalletOption.TREZOR]: 'trezor',
  [WalletOption.XDEFI]: 'xdefi',
  [WalletOption.KEPLR]: 'keplr',
  [WalletOption.OKX]: 'okx',
  [WalletOption.OKX_MOBILE]: 'okx',
};

export const WalletIcon = ({ className, walletType, size, tooltipDisabled, onClick }: Props) => {
  const tooltipContent =
    walletType === WalletOption.KEYSTORE
      ? t('views.walletModal.viewPhrase')
      : walletType === WalletOption.LEDGER && !IS_LEDGER_LIVE
        ? t('views.walletModal.verifyAddress')
        : t('views.wallet.walletTypeConnected', {
            walletType: walletType ? WalletNameByWalletOption[walletType] : t('common.connected'),
          });

  return (
    <Tooltip content={tooltipContent} disabled={tooltipDisabled}>
      <Box className={onClick ? baseHoverClass : className} onClick={onClick}>
        {walletType && <Icon name={walletIcons[walletType]} size={size} />}
      </Box>
    </Tooltip>
  );
};
