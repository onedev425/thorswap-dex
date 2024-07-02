import type { Chain } from "@swapkit/sdk";
import { AssetValue } from "@swapkit/sdk";
import classNames from "classnames";
import { Box } from "components/Atomic";
import { useWallet } from "context/wallet/hooks";
import { chainName } from "helpers/chainName";
import { useFetchThornames } from "hooks/useFetchThornames";
import { memo, useCallback, useMemo } from "react";
import { SORTED_CHAINS } from "settings/chain";
import { useApp } from "store/app/hooks";
import { ViewMode } from "types/app";
import { AccountRow } from "views/Wallet/AccountRow";

import { AccountCard } from "./AccountCard";

type Props = {
  keyword: string;
  onlyConnected: boolean;
};

export const AccountType = memo(({ onlyConnected, keyword }: Props) => {
  const { getWalletAddress } = useWallet();
  const { walletViewMode } = useApp();
  const registeredThornames = useFetchThornames();

  const filteredChains = useMemo(
    () =>
      SORTED_CHAINS.filter((chain) => {
        const sigAsset = AssetValue.fromChainOrSignature(chain as Chain);
        const lowerKeyword = keyword.toLowerCase();

        const isSupported = [
          sigAsset.chain.toLowerCase(),
          sigAsset.symbol.toLowerCase(),
          chainName(chain, true).toLowerCase(),
        ].some((item) => item.includes(lowerKeyword));

        return isSupported && (onlyConnected ? !!getWalletAddress(chain) : true);
      }) as Chain[],
    [getWalletAddress, keyword, onlyConnected],
  );

  const getThornames = useCallback(
    (chain: Chain) => {
      const address = getWalletAddress(chain);
      if (!(registeredThornames && address)) return [];

      return registeredThornames.reduce((acc, { entries = [], thorname }) => {
        const entry = entries.find((e) => e.address === address);
        if (entry) acc.push(`${thorname}.${chain.toLowerCase()}`);
        return acc;
      }, [] as string[]);
    },
    [getWalletAddress, registeredThornames],
  );

  return (
    <Box
      col
      className={classNames({
        "gap-1.5 flex-1": walletViewMode === ViewMode.LIST,
        "grid w-full grid-cols-1 gap-2.5 lg:grid-cols-2 xl:grid-cols-3 md:flex-row":
          walletViewMode === ViewMode.CARD,
      })}
    >
      {filteredChains.map((chain) => {
        return walletViewMode === ViewMode.CARD ? (
          <AccountCard chain={chain} key={chain} thornames={getThornames(chain)} />
        ) : (
          <AccountRow chain={chain} key={chain} thornames={getThornames(chain)} />
        );
      })}
    </Box>
  );
});
