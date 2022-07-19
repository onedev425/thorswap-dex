import { useMemo, useCallback } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { Box } from 'components/Atomic'
import {
  LiquidityTypeOption,
  LiquidityTypeProps,
} from 'components/LiquidityType/types'
import { TabsSelect } from 'components/TabsSelect'

export const LiquidityType = ({
  poolAsset,
  onChange,
  selected,
  options,
  title,
}: LiquidityTypeProps) => {
  const tabWidth = `${Math.min(options.length, 3)}%`
  const lpOptions = useMemo(
    () => getOptionsProp(options, poolAsset),
    [options, poolAsset],
  )

  const onSelect = useCallback(
    (val: string) => {
      onChange(val as LiquidityTypeOption)
    },
    [onChange],
  )

  return (
    <Box className="self-stretch">
      <TabsSelect
        tabs={lpOptions}
        value={selected}
        onChange={onSelect}
        title={title}
        titleWidth="25%"
        tabWidth={tabWidth}
      />
    </Box>
  )
}

const getOptionsProp = (types: LiquidityTypeOption[], asset: Asset) => {
  const options: { value: string; label: string }[] = []
  if (types.includes(LiquidityTypeOption.ASSET)) {
    options.push({ value: LiquidityTypeOption.ASSET, label: asset.ticker })
  }

  if (types.includes(LiquidityTypeOption.SYMMETRICAL)) {
    options.push({
      value: LiquidityTypeOption.SYMMETRICAL,
      label: `${asset.ticker}+${Asset.RUNE().ticker}`,
    })
  }
  if (types.includes(LiquidityTypeOption.RUNE)) {
    options.push({
      value: LiquidityTypeOption.RUNE,
      label: Asset.RUNE().ticker,
    })
  }

  return options
}
