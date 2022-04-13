import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetButton } from 'components/AssetSelect/AssetButton'
import { Icon, Button } from 'components/Atomic'

import { t } from 'services/i18n'

type Props = {
  className?: string
  onClick?: () => void
  selected?: Maybe<Asset>
  showAssetType?: boolean
}

export const AssetSelectButton = ({
  className,
  onClick,
  selected,
  showAssetType,
}: Props) => {
  if (selected) {
    return (
      <AssetButton
        asset={selected}
        className={className}
        withChevron={Boolean(onClick)}
        onClick={onClick}
        showAssetType={showAssetType}
      />
    )
  }

  return (
    <div className={classNames('pl-8 pr-4', className)}>
      <Button
        variant="secondary"
        transform="uppercase"
        endIcon={
          <Icon
            className="ml-4 transition text-light-btn-secondary dark:text-dark-btn-secondary group-hover:text-light-typo-primary dark:group-hover:text-dark-typo-primary"
            name="chevronDown"
          />
        }
        onClick={onClick}
      >
        {t('components.assetSelect.selectAToken')}
      </Button>
    </div>
  )
}
