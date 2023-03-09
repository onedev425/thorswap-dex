import { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Box } from 'components/Atomic';
import { LiquidityTypeOption, LiquidityTypeProps } from 'components/LiquidityType/types';
import { TabsSelect } from 'components/TabsSelect';
import { useCallback, useMemo } from 'react';

export const LiquidityType = ({
  poolAsset,
  onChange,
  selected,
  options,
  title,
  tabsCount,
}: LiquidityTypeProps) => {
  const lpOptions = useMemo(() => getOptionsProp(options, poolAsset), [options, poolAsset]);

  const tabWidth = `${Math.floor(100 / Math.max(lpOptions.length, tabsCount || 3))}%`;

  const onSelect = useCallback(
    (val: string) => {
      onChange(val as LiquidityTypeOption);
    },
    [onChange],
  );

  return (
    <Box className="self-stretch">
      <TabsSelect
        onChange={onSelect}
        tabWidth={tabWidth}
        tabs={lpOptions}
        title={title}
        titleWidth="25%"
        value={selected}
      />
    </Box>
  );
};

const getOptionsProp = (types: LiquidityTypeOption[], asset: Asset) => {
  const options: { value: string; label: string }[] = [];
  if (types.includes(LiquidityTypeOption.ASSET)) {
    options.push({ value: LiquidityTypeOption.ASSET, label: asset.ticker });
  }

  if (types.includes(LiquidityTypeOption.SYMMETRICAL)) {
    options.push({
      value: LiquidityTypeOption.SYMMETRICAL,
      label: `${asset.ticker}+${Asset.RUNE().ticker}`,
    });
  }
  if (types.includes(LiquidityTypeOption.RUNE)) {
    options.push({
      value: LiquidityTypeOption.RUNE,
      label: Asset.RUNE().ticker,
    });
  }

  return options;
};
