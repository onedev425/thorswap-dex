import type { Chain } from '@swapkit/core';
import { AssetValue } from '@swapkit/core';
import { Box, Button, Table } from 'components/Atomic';
import { CollapseChevron } from 'components/Atomic/Collapse/CollapseChevron';
import { memo, useCallback, useState } from 'react';
import { t } from 'services/i18n';
import type { GetTokenPriceResponseItem } from 'store/thorswap/types';

import { useColumns } from './useColumns';

type Props = {
  chainInfo: AssetValue[];
  chain: Chain;
  priceData: Record<string, GetTokenPriceResponseItem>;
  chainAddress: string;
};

export const ChainInfoTable = memo(({ priceData, chainInfo, chain, chainAddress }: Props) => {
  const [showAllTokens, setShowAllTokens] = useState(false);
  const sigAsset = AssetValue.fromChainOrSignature(chain);

  const altAssets = chainInfo.filter((item) => !item.eq(sigAsset));
  const sigAssetAmount =
    chainInfo.find((item) => item.eq(sigAsset)) ||
    AssetValue.fromChainOrSignature(sigAsset.chain, 0);

  const handleToggleTokens = useCallback(() => {
    setShowAllTokens((v) => !v);
  }, []);

  const columns = useColumns(chainAddress, chain, priceData);
  const tableData = showAllTokens ? [sigAssetAmount, ...altAssets] : [sigAssetAmount];

  return (
    <Box col className="transition-all">
      <Table
        // @ts-expect-error Overall typing for `react-table` is broken
        columns={columns}
        data={tableData}
        hasShadow={false}
        sortable={tableData.length > 1}
      />
      {!!altAssets.length && (
        <Button
          leftIcon={<CollapseChevron isActive={showAllTokens} />}
          onClick={handleToggleTokens}
          variant="tint"
        >
          {showAllTokens ? t('views.wallet.hideTokens') : t('views.wallet.showAllTokens')}
        </Button>
      )}
    </Box>
  );
});
