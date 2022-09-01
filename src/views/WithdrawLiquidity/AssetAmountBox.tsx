import { Asset } from '@thorswap-lib/multichain-sdk';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon/AssetIcon';
import { Box, Typography } from 'components/Atomic';
import { genericBgClasses } from 'components/constants';

type Props = {
  className?: string;
  asset: Asset;
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
        <Typography>{amount || '-'}</Typography>
        <Typography color="secondary" fontWeight="normal">
          {asset.ticker}
        </Typography>
      </Box>
    </Box>
  );
};
