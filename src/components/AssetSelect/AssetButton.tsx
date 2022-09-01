import { Asset } from '@thorswap-lib/multichain-sdk';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon/AssetIcon';
import { Box, Button, Icon, Typography } from 'components/Atomic';

type Props = {
  className?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
  asset: Asset;
  withChevron?: boolean;
  showAssetType?: boolean;
};

export function AssetButton({
  className,
  asset,
  size = 'md',
  withChevron,
  showAssetType,
  onClick,
}: Props) {
  return (
    <Button
      className={classNames(
        className,
        'pl-1 pr-2 !rounded-full !h-10 !hover:bg-light-gray-primary border !border-solid !border-opacity-40 border-dark-gray-primary !hover:bg-dark-gray-primary',
        { 'pr-4': !withChevron },
      )}
      endIcon={withChevron ? <Icon color="primary" name="chevronDown" /> : null}
      onClick={onClick}
      size={size}
      startIcon={<AssetIcon asset={asset} size={28} />}
      transform="uppercase"
      variant="tint"
    >
      <Box col className="text-left">
        <Typography
          className="!leading-5"
          fontWeight="medium"
          transform="uppercase"
          variant="subtitle2"
        >
          {asset.ticker}
        </Typography>
        {showAssetType && (
          <Typography
            className="!leading-4"
            color={asset.isSynth ? 'primaryBtn' : 'secondary'}
            fontWeight="normal"
            transform="uppercase"
            variant="caption-xs"
          >
            {asset.type}
          </Typography>
        )}
      </Box>
    </Button>
  );
}
