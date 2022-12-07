import { Asset } from '@thorswap-lib/multichain-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Typography } from 'components/Atomic';
import { useFormatPrice } from 'helpers/formatPrice';
import { memo } from 'react';
import { t } from 'services/i18n';
import { getFilledColor } from 'views/Earn/utils';

import { AssetSelectType } from '../../components/AssetSelect/types';

type Props = AssetSelectType & {
  select: (asset: Asset) => void;
};

export const EarnAssetSelectItem = memo(
  ({ asset, logoURI, balance, select, value, apr, filled }: Props) => {
    const formatPrice = useFormatPrice();

    return (
      <Box
        alignCenter
        className="bg-dark-dark-gray rounded-3xl p-2 hover:duration-150 transition cursor-pointer  dark:hover:bg-dark-border-primary hover:bg-light-bg-secondary"
        onClick={() => select(asset)}
      >
        <Box className="gap-x-3 pl-2" flex={1}>
          <Box center className="gap-x-2">
            <AssetIcon asset={asset} logoURI={logoURI} size={34} />
          </Box>

          <Box col>
            <Typography fontWeight="medium" variant="body">
              {asset?.ticker}
            </Typography>
            <Box alignCenter row className="gap-x-2">
              <Box center className="gap-1">
                <Typography
                  color="secondary"
                  fontWeight="light"
                  transform="uppercase"
                  variant="caption"
                >
                  {t('common.APR')}
                </Typography>
                <Typography color="primaryBtn" variant="caption">
                  {apr ? apr : 'N/A'}
                </Typography>
              </Box>

              <Box center className="gap-1">
                <Typography
                  color="secondary"
                  fontWeight="light"
                  transform="uppercase"
                  variant="caption"
                >
                  {t('common.filled')}
                </Typography>
                <Typography color={getFilledColor(filled)} variant="caption">
                  {filled ? filled : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="pr-2">
          <Box col justify="end">
            <Typography className="text-right" color="secondary" variant="caption">
              {balance?.gt(0) ? balance.toSignificant(6) : ''}
            </Typography>

            <Box className="gap-x-1" justify="end">
              <Typography color="secondary" variant="caption-xs">
                {value?.gt(0) ? `${formatPrice(value)} ` : ''}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  },
);
