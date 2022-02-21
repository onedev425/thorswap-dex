import classNames from 'classnames'

import { AssetTickerType } from 'components/AssetIcon/types'
import { AssetButton } from 'components/AssetSelect/AssetButton'
import { Icon, Button } from 'components/Atomic'

import { t } from 'services/i18n'

type Props = {
  className?: string
  onClick: () => void
  selected?: Maybe<AssetTickerType>
}

export const AssetSelectButton = ({ className, onClick, selected }: Props) => {
  if (selected) {
    return (
      <AssetButton
        onClick={onClick}
        name={selected}
        className={className}
        withChevron
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
            className="ml-4 text-light-btn-secondary dark:text-dark-btn-secondary group-hover:text-light-typo-primary dark:group-hover:text-dark-typo-primary transition"
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
