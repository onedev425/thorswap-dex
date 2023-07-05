import { Amount, AssetAmount, getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { Box, Button, Table } from 'components/Atomic';
import { CollapseChevron } from 'components/Atomic/Collapse/CollapseChevron';
import { memo, useCallback, useState } from 'react';
import { t } from 'services/i18n';
import { GetTokenPriceResponseItem } from 'store/thorswap/types';

import { useColumns } from './useColumns';

type Props = {
  chainInfo: AssetAmount[];
  chain: Chain;
  priceData: Record<string, GetTokenPriceResponseItem>;
  chainAddress: string;
};

export const ChainInfoTable = memo(({ priceData, chainInfo, chain, chainAddress }: Props) => {
  const [showAllTokens, setShowAllTokens] = useState(false);
  const sigAsset = getSignatureAssetFor(chain);

  const altAssets = chainInfo.filter((item) => !item.asset.eq(sigAsset));
  const sigAssetAmount =
    chainInfo.find((item) => item.asset.eq(sigAsset)) ||
    new AssetAmount(sigAsset, Amount.fromNormalAmount(0));

  const handleToggleTokens = useCallback(() => {
    setShowAllTokens((v) => !v);
  }, []);

  const columns = useColumns(chainAddress, chain, priceData);
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
