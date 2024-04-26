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
      case 'thor': {
        return <FilterTypeLabel icon={<Icon name="thor" size={20} />} label={filterType.label} />;
      }
      case 'btc': {
        return (
          <FilterTypeLabel
            icon={<AssetIcon asset={AssetValue.fromChainOrSignature(Chain.Bitcoin)} size={20} />}
            label="BTC"
          />
        );
      }
      case 'doge': {
        return (
          <FilterTypeLabel
            icon={<AssetIcon asset={AssetValue.fromChainOrSignature(Chain.Dogecoin)} size={20} />}
            label="DOGE"
          />
        );
      }
      case 'dot': {
        return (
          <FilterTypeLabel
            icon={<AssetIcon asset={AssetValue.fromChainOrSignature(Chain.Polkadot)} size={20} />}
            label="DOT"
          />
        );
      }
      case 'bch': {
        return (
          <FilterTypeLabel
            icon={
              <AssetIcon asset={AssetValue.fromChainOrSignature(Chain.BitcoinCash)} size={20} />
            }
            label="BCH"
          />
        );
      }
      case 'ltc': {
        return (
          <FilterTypeLabel
            icon={<AssetIcon asset={AssetValue.fromChainOrSignature(Chain.Litecoin)} size={20} />}
            label="LTC"
          />
        );
      }
      case 'dash': {
        return (
          <FilterTypeLabel
            icon={<AssetIcon asset={AssetValue.fromChainOrSignature(Chain.Dash)} size={20} />}
            label="DASH"
          />
        );
      }
      case 'gaia': {
        return (
          <FilterTypeLabel
            icon={<AssetIcon asset={AssetValue.fromChainOrSignature(Chain.Cosmos)} size={20} />}
            label="COSMOS"
          />
        );
      }
      case 'maya': {
        return (
          <FilterTypeLabel
            icon={<AssetIcon asset={AssetValue.fromChainOrSignature(Chain.Maya)} size={20} />}
            label="MAYA"
          />
        );
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
            icon={
              <AssetIcon
                asset={AssetValue.fromStringSync(
                  'ARB.ARB-0x912ce59144191c1204e64559fe8253a0e49e6548',
                )}
                size={20}
                hasChainIcon={false}
              />
            }
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
      case 'kuji': {
        return (
          <FilterTypeLabel
            icon={<AssetIcon asset={AssetValue.fromChainOrSignature(Chain.Kujira)} size={20} />}
            label="KUJI"
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
