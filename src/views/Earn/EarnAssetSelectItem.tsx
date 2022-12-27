import { CircularProgress, Flex, Spinner } from '@chakra-ui/react';
import { Asset } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Tooltip, Typography } from 'components/Atomic';
import { memo } from 'react';
import { t } from 'services/i18n';
import { getFormattedPercent } from 'views/Earn/utils';

import { AssetSelectType } from '../../components/AssetSelect/types';

type Props = AssetSelectType & {
  select: (asset: Asset) => void;
  isSelected?: boolean;
};

export const EarnAssetSelectItem = memo(
  ({ asset, logoURI, select, apr, filled, isSelected, balance }: Props) => {
    return (
      <Box
        alignCenter
        className={classNames(
          'dark:bg-dark-dark-gray bg-btn-light-tint z-0 lig rounded-3xl p-2 hover:duration-150 transition cursor-pointer  dark:hover:bg-dark-border-primary hover:bg-btn-light-tint-active border border-transparent',
          {
            'brightness-90 dark:brightness-110 dark:!bg-dark-border-primary !bg-btn-light-tint-active border-btn-primary':
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
            <Box alignCenter justify="between">
              <Typography fontWeight="medium" variant="body">
                {asset?.ticker}
              </Typography>
            </Box>
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
                {typeof apr !== 'undefined' ? (
                  <Typography color="primaryBtn" variant="caption">
                    {apr ? apr : 'N/A'}
                  </Typography>
                ) : (
                  <Spinner size="xs" />
                )}
              </Box>
            </Box>
          </Box>

          <Box center className="gap-2">
            {!!balance && (
              <Typography color="secondary" fontWeight="medium" variant="caption-xs">
                {balance.toSignificantWithMaxDecimals(6)}
              </Typography>
            )}

            {typeof filled !== 'undefined' && (
              // <Typography
              //   color="secondary"
              //   // color={getFilledColor(filled)}
              //   variant="caption"
              // >
              //   {getFormattedPercent(filled) || 'N/A'}
              // </Typography>
              <Tooltip content={`${t('common.filled')}: ${getFormattedPercent(filled) || 'N/A'}`}>
                <Flex position="relative">
                  <CircularProgress
                    color="brand.btnPrimary"
                    size="35px"
                    trackColor="borderPrimary"
                    value={filled}
                  />
                  <Flex
                    alignItems="center"
                    bottom={0}
                    justifyContent="center"
                    left={0}
                    position="absolute"
                    right={0}
                    top={0}
                  >
                    <Typography
                      className={classNames('text-[10px]', { 'text-[9px]': filled >= 100 })}
                      color="secondary"
                      fontWeight="semibold"
                      variant="caption-xs"
                    >
                      {Math.floor(filled)}%
                    </Typography>
                  </Flex>
                </Flex>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
    );
  },
);
