import { Icon } from 'components/Atomic';

import { SortType } from './types';

type Props = {
  sortType: SortType;
};

export const SortIndicator = (props: Props) => {
  const { sortType } = props;

  return (
    <div className="flex flex-col">
      <Icon
        className="-mb-1.5"
        color={sortType === SortType.Asc ? 'primary' : 'secondary'}
        name="sortUp"
        size={12}
      />
      <Icon
        className="-mt-1"
        color={sortType === SortType.Desc ? 'primary' : 'secondary'}
        name="sortDown"
        size={12}
      />
    </div>
  );
};
