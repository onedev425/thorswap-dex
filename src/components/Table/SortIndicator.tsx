import { Icon } from 'components/Icon'

import { SortType } from './types'

type Props = {
  sortType: SortType
}

export const SortIndicator = (props: Props) => {
  const { sortType } = props

  return (
    <div className="flex flex-col">
      <Icon
        className="-mb-1.5"
        name="sortUp"
        size={12}
        color={sortType === SortType.Asc ? 'primary' : 'secondary'}
      />
      <Icon
        className="-mt-1"
        name="sortDown"
        size={12}
        color={sortType === SortType.Desc ? 'primary' : 'secondary'}
      />
    </div>
  )
}
