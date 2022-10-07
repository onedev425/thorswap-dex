import { Asset } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { AssetFilterType, assetFilterTypes } from 'components/AssetSelect/assetTypes';
import { Box, Typography } from 'components/Atomic';

const FilterTypeLabel = ({
  asset,
  label,
  className,
}: {
  asset?: Asset;
  label: string;
  className?: string;
}) => (
  <Box center className={classNames('whitespace-nowrap gap-1', className)}>
    {!!asset && <AssetIcon asset={asset} size={20} />}
    <Typography fontWeight="semibold" variant="caption-xs">
      {label}
    </Typography>
  </Box>
);

export const useAssetFilterTypes = () => {
  const getTypeLabel = (filterType: AssetFilterType) => {
    switch (filterType.value) {
      case 'all': {
        return <FilterTypeLabel className="mx-2" label={filterType.label} />;
      }
      case 'avax': {
        return <FilterTypeLabel asset={Asset.AVAX()} label="AVAX" />;
      }
      case 'erc20': {
        return <FilterTypeLabel asset={Asset.ETH()} label="ETH" />;
      }
      case 'bep2': {
        return <FilterTypeLabel asset={Asset.BNB()} label="BNB" />;
      }
      default:
        return <FilterTypeLabel label={filterType.label} />;
    }
  };

  const filterTypes = assetFilterTypes.map((filterType) => ({
    value: filterType.value,
    label: getTypeLabel(filterType),
    tooltip: filterType.tooltip,
  }));

  return filterTypes;
};
