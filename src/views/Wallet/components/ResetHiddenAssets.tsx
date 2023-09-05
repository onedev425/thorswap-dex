import type { Chain } from '@thorswap-lib/types';
import { HoverIcon } from 'components/HoverIcon';
import { t } from 'i18next';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/store';
import { useWallet } from 'store/wallet/hooks';
import { actions } from 'store/wallet/slice';

type Props = {
  chain: Chain;
};

export const ResetHiddenAssets = ({ chain }: Props) => {
  const { hiddenAssets } = useWallet();
  const appDispatch = useAppDispatch();

  const handleResetHiddenAssets = useCallback(() => {
    appDispatch(actions.clearChainHiddenAssets(chain));
  }, [appDispatch, chain]);

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
