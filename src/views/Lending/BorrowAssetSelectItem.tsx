import { Text } from '@chakra-ui/react';
import { AssetEntity } from '@thorswap-lib/swapkit-core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Icon, Tooltip } from 'components/Atomic';
import { memo } from 'react';
import { t } from 'services/i18n';

import { AssetSelectType } from '../../components/AssetSelect/types';

type Props = AssetSelectType & {
  select: (asset: AssetEntity) => void;
  isSelected?: boolean;
};

export const BorrowAssetSelectItem = memo(
  ({ asset, logoURI, select, extraInfo, isSelected, balance }: Props) => {
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
              <Text fontWeight="medium" textStyle="body">
                {asset?.ticker}
              </Text>
            </Box>
            <Box row className="gap-x-2 justify-between pr-2">
              <Tooltip content={t('views.lending.collateralizationRatio')}>
                <Box center className="gap-1">
                  <Text
                    fontWeight="light"
                    textStyle="caption"
                    textTransform="uppercase"
                    variant="secondary"
                  >
                    {t('views.lending.cr')}
                  </Text>

                  <Text textStyle="caption" variant="primaryBtn">
                    {extraInfo ? `${extraInfo}%` : 'N/A'}
                  </Text>

                  <Icon color="secondary" name="infoCircle" size={14} />
                </Box>
              </Tooltip>
            </Box>
          </Box>

          <Box center className="gap-2">
            {!!balance && (
              <Text fontWeight="medium" textStyle="caption-xs" variant="secondary">
                {balance.toSignificant(6)}
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    );
  },
);
