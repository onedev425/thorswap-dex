import { Box, Icon } from 'components/Atomic'

import { useAssets } from 'store/assets/hooks'
import { useAppSelector } from 'store/store'

type Props = {
  assetString: string
}

export const FeaturedAssetIcon = ({ assetString }: Props) => {
  const { addFeatured, removeFeatured } = useAssets()
  const { featured } = useAppSelector((state) => state.assets)
  const isFeatured = featured.includes(assetString)

  return (
    <Box
      center
      onClick={(e) => {
        e.stopPropagation()
        if (isFeatured) {
          removeFeatured(assetString)
        } else {
          addFeatured(assetString)
        }
      }}
    >
      <Icon name={isFeatured ? 'starFilled' : 'starEmpty'} size={18} />
    </Box>
  )
}
