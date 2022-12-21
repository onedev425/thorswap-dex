import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { Box } from 'components/Atomic';
import { chainToSigAsset } from 'helpers/assets';
import { chainName } from 'helpers/chainName';
import { useFetchThornames } from 'hooks/useFetchThornames';
import { memo, useCallback, useMemo } from 'react';
import { SORTED_CHAINS } from 'settings/chain';
import { useApp } from 'store/app/hooks';
import { useWallet } from 'store/wallet/hooks';
import { ViewMode } from 'types/app';
import { AccountRow } from 'views/Wallet/AccountRow';

import { AccountCard } from './AccountCard';

type Props = {
  keyword: string;
  onlyConnected: boolean;
};

export const AccountType = memo(({ onlyConnected, keyword }: Props) => {
  const { wallet } = useWallet();
  const { walletViewMode } = useApp();
  const registeredThornames = useFetchThornames();

  const filteredChains = useMemo(
    () =>
      SORTED_CHAINS.filter((chain) => {
        const sigAsset = chainToSigAsset(chain as Chain);
        const lowerKeyword = keyword.toLowerCase();

        const isSupported = [
          sigAsset.chain.toLowerCase(),
          sigAsset.symbol.toLowerCase(),
          chainName(chain, true).toLowerCase(),
        ].some((item) => item.includes(lowerKeyword));

        return isSupported && (onlyConnected ? !!wallet?.[chain]?.address : true);
      }) as Chain[],
    [keyword, onlyConnected, wallet],
  );

  const getThornames = useCallback(
    (chain: Chain) => {
      const { address } = wallet?.[chain] || {};
      if (!(registeredThornames && address)) return [];

      return registeredThornames.reduce((acc, { entries, thorname }) => {
        const entry = entries.find((e) => e.address === address);
        if (entry) acc.push(`${thorname}.${chain.toLowerCase()}`);
        return acc;
      }, [] as string[]);
    },
    [registeredThornames, wallet],
  );

  return (
    <Box
      col
      className={classNames({
        'gap-1.5 flex-1': walletViewMode === ViewMode.LIST,
        'grid w-full grid-cols-1 gap-2.5 lg:grid-cols-2 xl:grid-cols-3 md:flex-row':
          walletViewMode === ViewMode.CARD,
      })}
    >
      {filteredChains.map((chain) =>
        walletViewMode === ViewMode.CARD ? (
          <AccountCard chain={chain} key={chain} thornames={getThornames(chain)} />
        ) : (
          <AccountRow chain={chain} key={chain} thornames={getThornames(chain)} />
        ),
      )}
    </Box>
  );
});
