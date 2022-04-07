import { Icon } from 'components/Atomic'

import { useAssets } from 'store/assets/hooks'

type Props = {
  assetString: string
}

export const FeaturedAssetIcon = ({ assetString }: Props) => {
  const { featured, addFeatured, removeFeatured } = useAssets()
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
