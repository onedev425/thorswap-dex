import { Text } from '@chakra-ui/react';
import { AssetEntity } from '@thorswap-lib/swapkit-core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon/AssetIcon';
import { Box, Button, Icon } from 'components/Atomic';

type Props = {
  className?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
  asset: AssetEntity;
  withChevron?: boolean;
  showAssetType?: boolean;
  logoURI?: string;
  assetTypeComponent?: React.ReactNode;
};

export function AssetButton({
  className,
  asset,
  size = 'md',
  withChevron,
  showAssetType,
  assetTypeComponent,
  onClick,
  logoURI,
}: Props) {
  return (
    <Button
      className={classNames(
        className,
        '!rounded-full !h-10 !hover:bg-light-gray-primary border !border-solid !border-opacity-40 border-dark-gray-primary !hover:bg-dark-gray-primary inline-flex !min-w-fit !ps-0 !pe-0 px-0',
      )}
      onClick={onClick}
      size={size}
      textTransform="uppercase"
      variant="tint"
    >
      <Box center className="gap-2.5 mx-1">
        <AssetIcon asset={asset} logoURI={logoURI} size={28} />
        <Box col className="text-left">
          <Text
            className="!leading-5"
            fontWeight="medium"
            textStyle="subtitle2"
            textTransform="uppercase"
          >
            {asset.ticker}
          </Text>
          {showAssetType &&
            (assetTypeComponent ? (
              assetTypeComponent
            ) : (
              <Text
                className="!leading-4"
                fontWeight="normal"
                textStyle="caption-xs"
                textTransform="uppercase"
                variant={asset.isSynth ? 'primaryBtn' : 'secondary'}
              >
                {asset.type}
              </Text>
            ))}
        </Box>
        {withChevron && <Icon color="primary" name="chevronDown" />}
      </Box>
    </Button>
  );
}
