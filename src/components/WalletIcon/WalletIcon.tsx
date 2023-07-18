import { WalletOption } from '@thorswap-lib/types';
import { Box, Icon, IconName, Tooltip } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { WalletNameByWalletOption } from 'components/Modals/ConnectWalletModal/types';
import { t } from 'services/i18n';

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
  [WalletOption.LEDGER]: 'ledger',
  // [WalletOption.LEDGER_LIVE]: 'ledger',
  [WalletOption.KEYSTORE]: 'keystore',
  [WalletOption.WALLETCONNECT]: 'walletConnect',
  [WalletOption.TREZOR]: 'trezor',
  [WalletOption.XDEFI]: 'xdefi',
  [WalletOption.KEPLR]: 'keplr',
  [WalletOption.OKX]: 'okx',
};

export const WalletIcon = ({ className, walletType, size, tooltipDisabled, onClick }: Props) => {
  const tooltipContent =
    walletType === WalletOption.KEYSTORE
      ? t('views.walletModal.viewPhrase')
      : t('views.wallet.walletTypeConnected', {
          walletType: walletType ? WalletNameByWalletOption[walletType] : 'This should not happen',
        });

  return (
    <Tooltip content={tooltipContent} disabled={tooltipDisabled}>
      <Box className={onClick ? baseHoverClass : className} onClick={onClick}>
        {walletType && <Icon name={walletIcons[walletType]} size={size} />}
      </Box>
    </Tooltip>
  );
};
