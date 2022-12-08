import { Asset } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Typography } from 'components/Atomic';
import { memo } from 'react';
import { t } from 'services/i18n';
import { getFilledColor } from 'views/Earn/utils';

import { AssetSelectType } from '../../components/AssetSelect/types';

type Props = AssetSelectType & {
  select: (asset: Asset) => void;
  isSelected?: boolean;
};

export const EarnAssetSelectItem = memo(
  ({ asset, logoURI, select, apr, filled, isSelected }: Props) => {
    return (
      <Box
        alignCenter
        className={classNames(
          'dark:bg-dark-dark-gray bg-btn-light-tint lig rounded-3xl p-2 hover:duration-150 transition cursor-pointer  dark:hover:bg-dark-border-primary hover:bg-btn-light-tint-active',
          {
            'brightness-90 dark:brightness-110 dark:!bg-dark-border-primary !bg-btn-light-tint-active':
              isSelected,
          },
        )}
        onClick={() => select(asset)}
      >
        <Box className="gap-x-3 pl-2" flex={1}>
          <Box center className="gap-x-2">
            <AssetIcon asset={asset} logoURI={logoURI} size={34} />
          </Box>

          <Box col flex={1}>
            <Typography fontWeight="medium" variant="body">
              {asset?.ticker}
            </Typography>
            <Box row className="gap-x-2 justify-between pr-2">
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
                <Typography color={getFilledColor(filled)} variant="caption">
                  {filled ? filled : 'N/A'}
                </Typography>
                <Typography
                  color="secondary"
                  fontWeight="light"
                  transform="uppercase"
                  variant="caption"
                >
                  {t('common.filled')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  },
);
