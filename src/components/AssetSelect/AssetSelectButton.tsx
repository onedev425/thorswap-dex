import { AssetTickerType } from 'components/AssetIcon/types'
import { AssetButton } from 'components/AssetSelect/AssetButton'
import { Button } from 'components/Button'
import { Icon } from 'components/Icon'

type Props = {
  onClick: () => void
  selected?: Maybe<AssetTickerType>
}

export const AssetSelectButton = ({ onClick, selected }: Props) => {
  if (selected) {
    return (
      <AssetButton onClick={onClick} name={selected} size="large" withChevron />
    )
  }

  return (
    <Button
      className="pl-8 pr-4"
      size="large"
      outline
      bgColor="secondary"
      transform="uppercase"
      endIcon={
        <Icon
          className="ml-4 text-light-btn-secondary dark:text-dark-btn-secondary group-hover:text-light-typo-primary dark:group-hover:text-dark-typo-primary transition"
          name="chevronDown"
        />
      }
      onClick={onClick}
    >
      Select a token
    </Button>
  )
}
