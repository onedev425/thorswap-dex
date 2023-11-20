import type { Chain } from '@swapkit/core';
import { HoverIcon } from 'components/HoverIcon';
import { useWalletContext } from 'context/wallet/WalletProvider';
import { t } from 'i18next';
import { useCallback } from 'react';

type Props = {
  chain: Chain;
};

export const ResetHiddenAssets = ({ chain }: Props) => {
  const [{ hiddenAssets }, walletDispatch] = useWalletContext();

  const handleResetHiddenAssets = useCallback(() => {
    walletDispatch({ type: 'restoreHiddenAssets', payload: chain });
  }, [chain, walletDispatch]);

  if (!hiddenAssets[chain]) return null;

  return (
    <HoverIcon
      color="secondary"
      iconName="eye"
      onClick={handleResetHiddenAssets}
      size={16}
      tooltip={t('views.walletModal.showHiddenAssets') || ''}
    />
  );
};
