import { useMemo, useCallback } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { Select, Box } from 'components/Atomic'

import { PoolShareType } from 'redux/midgard/types'

import { LPTypeSelectorProps } from './types'

export const LPTypeSelector = ({
  poolAsset,
  onChange,
  selected,
  options,
}: LPTypeSelectorProps) => {
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
        activeIndex={optionToIndex(selected, lpOptions)}
        onChange={onSelectChange}
      />
    </Box>
  )
}

const getOptionsProp = (types: PoolShareType[], asset: Asset) => {
  const options: string[] = []
  if (types.includes(PoolShareType.ASSET_ASYM)) {
    options.push(`${asset.ticker} LP`)
  }
  if (types.includes(PoolShareType.SYM)) {
    options.push(`${asset.ticker}+RUNE LP`)
  }
  if (types.includes(PoolShareType.RUNE_ASYM)) {
    options.push('RUNE LP')
  }

  return options
}

const optionToIndex = (val: PoolShareType, options: string[]) => {
  if (options.includes(val as string)) return options.indexOf(val)

  return 0
}

const indexToOption = (val: number, options: string[], asset: Asset) => {
  const selected = options[val]

  if (selected === `${asset.ticker} LP`) {
    return PoolShareType.ASSET_ASYM
  }
  if (selected === `${asset.ticker}+RUNE LP`) {
    return PoolShareType.SYM
  }
  return PoolShareType.RUNE_ASYM
}
