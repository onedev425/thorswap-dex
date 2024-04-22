import { CircularProgress, Flex, Text } from '@chakra-ui/react';
import type { AssetValue } from '@swapkit/core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Icon, Tooltip } from 'components/Atomic';
import { memo } from 'react';
import { t } from 'services/i18n';
import { getFormattedPercent } from 'views/Earn/utils';

import type { AssetSelectType } from '../../components/AssetSelect/types';

type Props = AssetSelectType & {
  select: (asset: AssetValue) => void;
  isSelected?: boolean;
};

export const BorrowAssetSelectItem = memo(
  ({ asset, logoURI, select, extraInfo, isSelected, balance, filled }: Props) => {
    const isLimitReached = Number(filled) >= 100;
    const cr = extraInfo ? ((100 / Number(extraInfo)) * 100).toFixed(2) : '-';

    return (
      <Box
        alignCenter
        className={classNames(
          'dark:bg-dark-dark-gray bg-btn-light-tint z-0 lig rounded-3xl p-2 hover:duration-150 transition dark:hover:bg-dark-border-primary hover:bg-btn-light-tint-active border border-transparent',
          {
            'brightness-90 dark:brightness-110 dark:!bg-dark-border-primary !bg-btn-light-tint-active border-btn-primary':
              isSelected,
          },
          isLimitReached ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
        onClick={() => {
          !isLimitReached && select(asset);
        }}
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
              <Tooltip content={cr ? t('views.lending.crRatio', { cr }) : ''}>
                <Box center className="gap-1">
                  <Text
                    fontWeight="light"
                    textStyle="caption"
                    textTransform="uppercase"
                    variant="secondary"
                  >
                    LTV
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

          {isLimitReached && (
            <Box center>
              <Text color="brand.red" textStyle="caption-xs">
                {t('views.lending.capReached')}
              </Text>
            </Box>
          )}

          {typeof filled !== 'undefined' && (
            <Tooltip content={`${t('common.filled')}: ${getFormattedPercent(filled) || 'N/A'}`}>
              <Flex position="relative">
                <CircularProgress
                  color={isLimitReached ? 'brand.red' : 'brand.btnPrimary'}
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
                  <Text
                    className={classNames('text-[10px]', { 'text-[9px]': filled >= 100 })}
                    fontWeight="semibold"
                    textStyle="caption-xs"
                    variant="secondary"
                  >
                    {Math.floor(filled)}%
                  </Text>
                </Flex>
              </Flex>
            </Tooltip>
          )}
        </Box>
      </Box>
    );
  },
);
