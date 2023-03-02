import { Text } from '@chakra-ui/react';
import { Asset } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon/AssetIcon';
import { Box, Button, Icon } from 'components/Atomic';

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
        '!rounded-full !h-10 !hover:bg-light-gray-primary border !border-solid !border-opacity-40 border-dark-gray-primary !hover:bg-dark-gray-primary',
      )}
      leftIcon={<AssetIcon asset={asset} size={28} />}
      onClick={onClick}
      pl={withChevron ? '22px' : 1}
      pr={withChevron ? '22px' : 4}
      rightIcon={withChevron ? <Icon color="primary" name="chevronDown" /> : undefined}
      size={size}
      textTransform="uppercase"
      variant="tint"
    >
      <Box col className="text-left">
        <Text
          className="!leading-5"
          fontWeight="medium"
          textStyle="subtitle2"
          textTransform="uppercase"
        >
          {asset.ticker}
        </Text>
        {showAssetType && (
          <Text
            className="!leading-4"
            fontWeight="normal"
            textStyle="caption-xs"
            textTransform="uppercase"
            variant={asset.isSynth ? 'primaryBtn' : 'secondary'}
          >
            {asset.type}
          </Text>
        )}
      </Box>
    </Button>
  );
}
