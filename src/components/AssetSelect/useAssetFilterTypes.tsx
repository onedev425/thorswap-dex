import { Text } from '@chakra-ui/react';
import { AssetEntity } from '@thorswap-lib/swapkit-core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { AssetFilterType, assetFilterTypes } from 'components/AssetSelect/assetTypes';
import { Box, Icon } from 'components/Atomic';

const FilterTypeLabel = ({
  icon,
  label,
  className,
}: {
  icon?: JSX.Element;
  label: string;
  className?: string;
}) => (
  <Box center className={classNames('whitespace-nowrap gap-1', className)}>
    {icon || null}
    <Text fontWeight="semibold" textStyle="caption-xs">
      {label}
    </Text>
  </Box>
);

export const useAssetFilterTypes = () => {
  const getTypeLabel = (filterType: AssetFilterType) => {
    switch (filterType.value) {
      case 'all': {
        return <FilterTypeLabel className="mx-2" label={filterType.label.toUpperCase()} />;
      }
      case 'synth': {
        return <FilterTypeLabel icon={<Icon name="thor" size={18} />} label={filterType.label} />;
      }
      case 'avax': {
        return (
          <FilterTypeLabel icon={<AssetIcon asset={AssetEntity.AVAX()} size={20} />} label="AVAX" />
        );
      }
      case 'erc20': {
        return (
          <FilterTypeLabel icon={<AssetIcon asset={AssetEntity.ETH()} size={20} />} label="ETH" />
        );
      }
      case 'bep2': {
        return (
          <FilterTypeLabel icon={<AssetIcon asset={AssetEntity.BNB()} size={20} />} label="BNB" />
        );
      }
      default:
        return <FilterTypeLabel label={filterType.label.toUpperCase()} />;
    }
  };

  const filterTypes = assetFilterTypes.map((filterType) => ({
    value: filterType.value,
    label: getTypeLabel(filterType),
    tooltip: filterType.tooltip,
  }));

  return filterTypes;
};
