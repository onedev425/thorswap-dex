import { Select, Box } from 'components/Atomic'
import {
  LiquidityTypeOption,
  LiquidityTypeProps,
} from 'components/LiquidityType/types'

export const LiquidityType = ({
  assetName,
  onChange,
  selected,
}: LiquidityTypeProps) => {
  const onSelectChange = (index: number) => {
    const option = indexToOption(index)
    if (option) {
      onChange(option)
    }
  }
  const liquidityTypeOptions = [assetName, assetName + ' + RUNE', 'RUNE']
  return (
    <Box className="self-stretch">
      <Select
        options={liquidityTypeOptions}
        activeIndex={optionToIndex(selected)}
        onChange={onSelectChange}
      />
    </Box>
  )
}

const optionToIndex = (val: LiquidityTypeOption) => {
  switch (val) {
    case LiquidityTypeOption.Asset:
      return 0
    case LiquidityTypeOption.Symmetrical:
      return 1
    case LiquidityTypeOption.Rune:
      return 2
  }
}

const indexToOption = (val: number) => {
  switch (val) {
    case 0:
      return LiquidityTypeOption.Asset
    case 1:
      return LiquidityTypeOption.Symmetrical
    case 2:
      return LiquidityTypeOption.Rune
  }
}
