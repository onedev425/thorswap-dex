import { Amount, AssetAmount, chainToSigAsset } from '@thorswap-lib/multichain-core';
import { SupportedChain } from '@thorswap-lib/types';
import { Box, Button, Table } from 'components/Atomic';
import { CollapseChevron } from 'components/Atomic/Collapse/CollapseChevron';
import { memo, useCallback, useEffect, useState } from 'react';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { getCoingeckoData } from 'store/wallet/actions';
import { useWallet } from 'store/wallet/hooks';

import { useColumns } from './useColumns';

type Props = {
  chainInfo: AssetAmount[];
  chain: SupportedChain;
  chainAddress: string;
};

export const ChainInfoTable = memo(({ chainInfo, chain, chainAddress }: Props) => {
  const dispatch = useAppDispatch();
  const { wallet, geckoData, geckoDataLoading } = useWallet();
  const chainWalletBalances = wallet?.[chain]?.balance || [];

  useEffect(() => {
    chainWalletBalances.forEach(({ asset: { symbol } }) => {
      if (!geckoData?.[symbol] && !geckoDataLoading[symbol]) {
        dispatch(getCoingeckoData([symbol]));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainWalletBalances]);

  const [showAllTokens, setShowAllTokens] = useState(false);
  const sigAsset = chainToSigAsset(chain);

  const altAssets = chainInfo.filter((item) => !item.asset.eq(sigAsset));
  const sigAssetAmount =
    chainInfo.find((item) => item.asset.eq(sigAsset)) ||
    new AssetAmount(sigAsset, Amount.fromNormalAmount(0));

  const handleToggleTokens = useCallback(() => {
    setShowAllTokens((v) => !v);
  }, []);

  const columns = useColumns(chainAddress, chain);
  const tableData = showAllTokens ? [sigAssetAmount, ...altAssets] : [sigAssetAmount];

  return (
    <Box col className="transition-all">
      <Table
        // @ts-expect-error TODO: Overall typing for `react-table` is broken on our side
        columns={columns}
        data={tableData}
        hasShadow={false}
        sortable={tableData.length > 1}
      />
      {!!altAssets.length && (
        <Button
          onClick={handleToggleTokens}
          startIcon={<CollapseChevron isActive={showAllTokens} />}
          variant="tint"
        >
          {showAllTokens ? t('views.wallet.hideTokens') : t('views.wallet.showAllTokens')}
        </Button>
      )}
    </Box>
  );
});
