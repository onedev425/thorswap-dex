import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Box, Typography } from 'components/Atomic'
import { AssetDataType } from 'components/LiquidityCard/types'

export const AssetCard = ({
  assetTicker,
  assetName,
  amount,
}: AssetDataType) => {
  return (
    <Box className="h-8" alignCenter justify="between">
      <Box col>
        <Typography className="!text-dark-gray-primary">{assetName}</Typography>
      </Box>
      <Box className="gap-2" center>
        <Typography>{amount}</Typography>
        <AssetIcon size={27} name={assetTicker} />
      </Box>
    </Box>
  )
}
