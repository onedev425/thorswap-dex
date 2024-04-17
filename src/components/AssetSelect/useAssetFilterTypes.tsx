import { Text } from '@chakra-ui/react';
import { AssetValue, Chain } from '@swapkit/core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import type { AssetFilterType } from 'components/AssetSelect/assetTypes';
import { assetFilterTypes } from 'components/AssetSelect/assetTypes';
import { Box, Icon } from 'components/Atomic';
import { getChainIdentifier } from 'helpers/chains';
import { tokenLogoURL } from 'helpers/logoURL';

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
          <FilterTypeLabel
            icon={<AssetIcon asset={AssetValue.fromChainOrSignature(Chain.Avalanche)} size={20} />}
            label="AVAX"
          />
        );
      }
      case 'erc20': {
        return (
          <FilterTypeLabel
            icon={<AssetIcon asset={AssetValue.fromChainOrSignature(Chain.Ethereum)} size={20} />}
            label="ETH"
          />
        );
      }
      case 'arbitrum': {
        return (
          <FilterTypeLabel
            icon={<AssetIcon asset={AssetValue.fromChainOrSignature(Chain.Arbitrum)} size={20} />}
            label="ARB"
          />
        );
      }
      case 'bep20': {
        return (
          <FilterTypeLabel
            icon={
              <AssetIcon
                asset={AssetValue.fromChainOrSignature(Chain.BinanceSmartChain)}
                logoURI={tokenLogoURL({ identifier: getChainIdentifier(Chain.BinanceSmartChain) })}
                size={20}
              />
            }
            label="BSC"
          />
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
