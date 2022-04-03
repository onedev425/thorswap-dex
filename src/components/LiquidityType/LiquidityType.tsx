import { useMemo, useCallback } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { Select, Box } from 'components/Atomic'
import {
  LiquidityTypeOption,
  LiquidityTypeProps,
} from 'components/LiquidityType/types'

export const LiquidityType = ({
  poolAsset,
  onChange,
  selected,
  options,
}: LiquidityTypeProps) => {
  const lpOptions = useMemo(
    () => getOptionsProp(options, poolAsset),
    [options, poolAsset],
  )

  const onSelectChange = useCallback(
    (index: number) => {
      const option = indexToOption(index, lpOptions, poolAsset)
      if (option) {
        onChange(option)
      }
    },
    [lpOptions, poolAsset, onChange],
  )

  return (
    <Box className="self-stretch">
      <Select
        options={lpOptions}
        activeIndex={optionToIndex(selected, options)}
        onChange={onSelectChange}
      />
    </Box>
  )
}

const getOptionsProp = (types: LiquidityTypeOption[], asset: Asset) => {
  const options: string[] = []
  if (types.includes(LiquidityTypeOption.ASSET)) {
    options.push(`${asset.ticker}`)
  }
  if (types.includes(LiquidityTypeOption.SYMMETRICAL)) {
    options.push(`${asset.ticker}+RUNE`)
  }
  if (types.includes(LiquidityTypeOption.RUNE)) {
    options.push('RUNE')
  }

  return options
}

const optionToIndex = (
  val: LiquidityTypeOption,
  options: LiquidityTypeOption[],
) => {
  if (options.includes(val)) return options.indexOf(val)

  return 0
}

const indexToOption = (val: number, options: string[], asset: Asset) => {
  const selected = options[val]

  if (selected === `${asset.ticker}`) {
    return LiquidityTypeOption.ASSET
  }
  if (selected === `${asset.ticker}+RUNE`) {
    return LiquidityTypeOption.SYMMETRICAL
  }

  return LiquidityTypeOption.RUNE
}
