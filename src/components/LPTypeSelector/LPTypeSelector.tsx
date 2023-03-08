import { Asset } from '@thorswap-lib/multichain-core';
import { Box } from 'components/Atomic';
import { TabsSelect } from 'components/TabsSelect';
import { useCallback, useMemo } from 'react';
import { PoolShareType } from 'store/midgard/types';

import { LPTypeSelectorProps } from './types';

const getOptionsProp = (types: PoolShareType[], asset: Asset) => {
  const options: { label: string; value: string }[] = [];
  if (types.includes(PoolShareType.ASSET_ASYM)) {
    options.push({
      value: PoolShareType.ASSET_ASYM,
      label: `${asset.ticker} LP`,
    });
  }

  if (types.includes(PoolShareType.SYM)) {
    options.push({
      value: PoolShareType.SYM,
      label: `${asset.ticker}+RUNE LP`,
    });
  }

  if (types.includes(PoolShareType.RUNE_ASYM)) {
    options.push({
      value: PoolShareType.RUNE_ASYM,
      label: 'RUNE LP',
    });
  }

  if (types.includes(PoolShareType.PENDING)) {
    options.push({
      value: PoolShareType.PENDING,
      label: 'PENDING LP',
    });
  }

  return options;
};

export const LPTypeSelector = ({
  poolAsset,
  onChange,
  selected,
  options,
  title,
  tabsCount,
}: LPTypeSelectorProps) => {
  const lpOptions = useMemo(() => getOptionsProp(options, poolAsset), [options, poolAsset]);

  const tabWidth = `${Math.floor(100 / Math.max(lpOptions.length, tabsCount || 3))}%`;

  const onSelect = useCallback(
    (val: string) => {
      onChange(val as PoolShareType);
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
