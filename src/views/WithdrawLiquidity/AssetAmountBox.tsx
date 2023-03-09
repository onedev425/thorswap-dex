import { Text } from '@chakra-ui/react';
import { AssetEntity } from '@thorswap-lib/swapkit-core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon/AssetIcon';
import { Box } from 'components/Atomic';
import { genericBgClasses } from 'components/constants';

type Props = {
  className?: string;
  asset: AssetEntity;
  amount: string;
  stretch?: boolean;
};

export const AssetAmountBox = ({ className, asset, amount, stretch }: Props) => {
  return (
    <Box
      alignCenter
      className={classNames(
        'p-1 rounded-full flex-1 w-full self-stretch',
        { 'max-w-[150px]': !stretch },
        genericBgClasses.secondary,
        className,
      )}
    >
      <AssetIcon asset={asset} />

      <Box col className="ml-3">
        <Text>{amount || '-'}</Text>
        <Text fontWeight="normal" variant="secondary">
          {asset.ticker}
        </Text>
      </Box>
    </Box>
  );
};
