import { AssetEntity } from '@thorswap-lib/swapkit-core';
import classNames from 'classnames';
import { AssetButton } from 'components/AssetSelect/AssetButton';
import { Button, Icon } from 'components/Atomic';
import { t } from 'services/i18n';

type Props = {
  className?: string;
  onClick?: () => void;
  selected?: Maybe<AssetEntity>;
  showAssetType?: boolean;
};

export const AssetSelectButton = ({ className, onClick, selected, showAssetType }: Props) => {
  if (selected) {
    return (
      <AssetButton
        asset={selected}
        className={className}
        onClick={onClick}
        showAssetType={showAssetType}
        withChevron={Boolean(onClick)}
      />
    );
  }

  return (
    <div className={classNames('pl-8 pr-4', className)}>
      <Button
        stretch
        onClick={onClick}
        rightIcon={
          <Icon
            className="ml-4 transition text-light-btn-secondary dark:text-dark-btn-secondary group-hover:text-light-typo-primary dark:group-hover:text-dark-typo-primary"
            name="chevronDown"
          />
        }
        textTransform="uppercase"
        variant="secondary"
      >
        {t('components.assetSelect.selectAToken')}
      </Button>
    </div>
  );
};
