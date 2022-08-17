import { Icon } from 'components/Atomic'

import { useAssets } from 'store/assets/hooks'
import { useAppSelector } from 'store/store'

type Props = {
  assetString: string
}

export const FeaturedAssetIcon = ({ assetString }: Props) => {
  const { addFeatured, removeFeatured } = useAssets()
  const { featured } = useAppSelector((state) => state.assets)
  const isFeatured = featured.includes(assetString)

  return isFeatured ? (
    <div
      onClick={(e) => {
        e.stopPropagation()
        removeFeatured(assetString)
      }}
    >
      <Icon name="starFilled" size={18} />
    </div>
  ) : (
    <div
      onClick={(e) => {
        e.stopPropagation()
        addFeatured(assetString)
      }}
    >
      <Icon name="starEmpty" size={18} />
    </div>
  )
}
